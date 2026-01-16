// src/components/admin/UserManagement.jsx
import { memo, useState, useEffect, useCallback } from 'react';
import { supabase } from '../../lib/supabase';
import Swal from 'sweetalert2';
import styles from './AdminComponents.module.css';

const ROLES = ['user', 'subs', 'admin'];

const UserRow = memo(({ user, onRoleChange }) => {
  const [isChanging, setIsChanging] = useState(false);

  const handleRoleChange = async (e) => {
    const newRole = e.target.value;
    if (newRole === user.role) return;

    const result = await Swal.fire({
      title: 'Ubah Role User?',
      html: `Ubah role <strong>${user.username}</strong> menjadi <strong>${newRole}</strong>?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#007bff',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Ya, Ubah!',
      cancelButtonText: 'Batal'
    });

    if (result.isConfirmed) {
      setIsChanging(true);
      try {
        const { error } = await supabase
          .from('profiles')
          .update({ role: newRole })
          .eq('id', user.id);

        if (error) throw error;

        await onRoleChange();

        Swal.fire({
          icon: 'success',
          title: 'Role Berhasil Diubah',
          text: `Role ${user.username} telah diubah menjadi ${newRole}`,
          timer: 1500,
          showConfirmButton: false
        });
      } catch (err) {
        console.error('Error changing role:', err);
        Swal.fire({
          icon: 'error',
          title: 'Gagal Mengubah Role',
          text: err.message,
          confirmButtonColor: '#007bff'
        });
      } finally {
        setIsChanging(false);
      }
    }
  };

  return (
    <tr className={styles.tableRow}>
      <td className={styles.tableCell}>
        <div className={styles.userInfo}>
          <div className={styles.userAvatar}>
            {user.username?.charAt(0).toUpperCase() || 'U'}
          </div>
          <div>
            <div className={styles.userName}>{user.username || 'Unnamed'}</div>
            <div className={styles.userEmail}>{user.email}</div>
          </div>
        </div>
      </td>
      <td className={styles.tableCell}>
        <select
          className={styles.roleSelect}
          value={user.role}
          onChange={handleRoleChange}
          disabled={isChanging}
        >
          {ROLES.map(role => (
            <option key={role} value={role}>
              {role.toUpperCase()}
            </option>
          ))}
        </select>
      </td>
      <td className={styles.tableCell}>
        <span className={`${styles.statusBadge} ${user.email_confirmed_at ? styles.statusActive : styles.statusInactive}`}>
          {user.email_confirmed_at ? 'Verified' : 'Unverified'}
        </span>
      </td>
      <td className={styles.tableCell}>
        {new Date(user.created_at).toLocaleDateString('id-ID', {
          day: 'numeric',
          month: 'short',
          year: 'numeric'
        })}
      </td>
    </tr>
  );
});

UserRow.displayName = 'UserRow';

export default memo(function UserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      // Fetch all users from auth.users via profiles
      const { data: profiles, error: profileError } = await supabase
        .from('profiles')
        .select('id, username, role, created_at');

      if (profileError) throw profileError;

      // Fetch user details from auth
      const { data: { users: authUsers }, error: authError } = await supabase.auth.admin.listUsers();

      if (authError) {
        console.error('Auth error:', authError);
        // Fallback: just use profiles data
        setUsers(profiles.map(p => ({
          ...p,
          email: 'N/A',
          email_confirmed_at: null
        })));
      } else {
        // Merge profiles with auth data
        const mergedUsers = profiles.map(profile => {
          const authUser = authUsers.find(u => u.id === profile.id);
          return {
            ...profile,
            email: authUser?.email || 'N/A',
            email_confirmed_at: authUser?.email_confirmed_at || null
          };
        });
        setUsers(mergedUsers);
      }
    } catch (err) {
      console.error('Error fetching users:', err);
      Swal.fire({
        icon: 'error',
        title: 'Gagal Memuat Data User',
        text: err.message,
        confirmButtonColor: '#007bff'
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.username?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;

    return matchesSearch && matchesRole;
  });

  return (
    <div className={styles.section}>
      <div className={styles.sectionHeader}>
        <h3 className={styles.sectionTitle}>Daftar User</h3>
        <div className={styles.headerActions}>
          <input
            type="text"
            className={styles.searchInput}
            placeholder="Cari user..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <select
            className={styles.filterSelect}
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
          >
            <option value="all">Semua Role</option>
            {ROLES.map(role => (
              <option key={role} value={role}>
                {role.toUpperCase()}
              </option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <div className={styles.loading}>Memuat data user...</div>
      ) : filteredUsers.length === 0 ? (
        <div className={styles.empty}>Tidak ada user ditemukan</div>
      ) : (
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th className={styles.tableHeader}>User</th>
                <th className={styles.tableHeader}>Role</th>
                <th className={styles.tableHeader}>Status</th>
                <th className={styles.tableHeader}>Terdaftar</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map(user => (
                <UserRow
                  key={user.id}
                  user={user}
                  onRoleChange={fetchUsers}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className={styles.sectionFooter}>
        <p className={styles.footerText}>
          Total: <strong>{filteredUsers.length}</strong> user
        </p>
      </div>
    </div>
  );
});