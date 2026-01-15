import { memo, useState, useRef, useEffect, useCallback } from 'react';
import styles from './SoalList.module.css';
import { supabase } from '../../lib/supabase';
import Swal from 'sweetalert2';
import { LoadingScreen } from '../Navbar/Navbar';

/* ================= MODAL COMPONENT ================= */
const AddEditSoalModal = memo(({ open, onClose, onSubmit, initialData, loading }) => {
const [title, setTitle] = useState('');
const [description, setDescription] = useState('');
const [pdfFile, setPdfFile] = useState(null);
const fileInputRef = useRef(null);

useEffect(() => {
if (open) {
    setTitle(initialData?.title || '');
    setDescription(initialData?.description || '');
    setPdfFile(null);
    if (fileInputRef.current) {
    fileInputRef.current.value = '';
    }
}
}, [open, initialData]);

const handleSubmit = useCallback((e) => {
e.preventDefault();

const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20MB
if (pdfFile && pdfFile.size > MAX_FILE_SIZE) {
    Swal.fire({
    icon: 'warning',
    title: 'File Terlalu Besar',
    text: `Ukuran file maksimal ${MAX_FILE_SIZE / (1024 * 1024)}MB`,
    confirmButtonColor: '#007bff'
    });
    return;
}

onSubmit({
    id: initialData?.id,
    title,
    description,
    pdfFile,
    file_path: initialData?.file_path,
});
}, [title, description, pdfFile, initialData, onSubmit]);

if (!open) return null;

return (
<div className={styles.modalBackdrop} onClick={onClose}>
    <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
    <button 
        className={styles.modalClose}
        onClick={onClose}
        aria-label="Close modal"
    >
        ×
    </button>
    
    <h3 className={styles.modalTitle}>
        {initialData ? 'Edit Materi' : 'Tambah Materi Baru'}
    </h3>
    
    <form onSubmit={handleSubmit} className={styles.modalForm}>
        <div className={styles.formGroup}>
        <label className={styles.formLabel}>Judul Materi</label>
        <input
            className={styles.input}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Contoh: Latihan Aritmatika"
            required
            disabled={loading}
        />
        </div>
        
        <div className={styles.formGroup}>
        <label className={styles.formLabel}>Deskripsi</label>
        <textarea
            className={styles.textarea}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Deskripsi singkat tentang materi ini..."
            required
            disabled={loading}
            rows={4}
        />
        </div>
        
        <div className={styles.formGroup}>
        <label className={styles.formLabel}>
            File PDF {initialData && '(Opsional jika tidak ganti)'}
        </label>
        <div className={styles.fileInputWrapper}>
            <input
            type="file"
            className={styles.fileInput}
            accept="application/pdf"
            ref={fileInputRef}
            onChange={(e) => setPdfFile(e.target.files[0])}
            required={!initialData}
            disabled={loading}
            />
            {pdfFile && (
            <span className={styles.fileName}>
                {pdfFile.name} ({(pdfFile.size / (1024 * 1024)).toFixed(2)} MB)
            </span>
            )}
        </div>
        </div>
        
        <div className={styles.modalActions}>
        <button 
            type="button" 
            className={styles.modalBtnCancel} 
            onClick={onClose} 
            disabled={loading}
        >
            Batal
        </button>
        <button 
            type="submit" 
            className={styles.modalBtnSubmit} 
            disabled={loading}
        >
            {loading ? (
            <>
                <span className={styles.spinner} />
                Menyimpan...
            </>
            ) : (
            'Simpan Materi'
            )}
        </button>
        </div>
    </form>
    </div>
</div>
);
});

AddEditSoalModal.displayName = 'AddEditSoalModal';

/* ================= SOAL ITEM COMPONENT ================= */
const SoalItem = memo(({ item, onEdit, onDelete, onViewPDF, canEdit, currentUserId }) => {
const [imageError, setImageError] = useState(false);

return (
<div className={styles.soalItem}>
    <div className={styles.soalInfo}>
    <h4 className={styles.soalTitle}>{item.title}</h4>
    <p className={styles.soalDesc}>{item.description}</p>
    
    {/* Badge Owner */}
    {item.user_id !== currentUserId && item.username ? (
        <span className={styles.ownerBadge}>
        👤 Diunggah oleh: <strong>{item.username}</strong>
        </span>
    ) : item.user_id === currentUserId ? (
        <span className={styles.myFileBadge}>
        ✨ Materi Anda
        </span>
    ) : null}

    {/* Debug Info - Hapus setelah testing */}
    {process.env.NODE_ENV === 'development' && (
        <div style={{ 
        fontSize: '0.7rem', 
        color: '#888', 
        marginTop: '8px',
        padding: '4px',
        background: '#f0f0f0',
        borderRadius: '4px',
        wordBreak: 'break-all'
        }}>
        <strong>Path:</strong> {item.file_path}
        </div>
    )}
    </div>

    <div className={styles.soalActions}>
    {canEdit && (
        <button 
        className={`${styles.soalBtn} ${styles.soalBtnEdit}`}
        onClick={() => onEdit(item)}
        aria-label={`Edit ${item.title}`}
        >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M11.3337 2.00004C11.5089 1.82494 11.7169 1.68605 11.9457 1.59129C12.1745 1.49653 12.4197 1.44775 12.667 1.44775C12.9144 1.44775 13.1596 1.49653 13.3884 1.59129C13.6172 1.68605 13.8252 1.82494 14.0003 2.00004C14.1754 2.17513 14.3143 2.38314 14.4091 2.61195C14.5038 2.84075 14.5526 3.08591 14.5526 3.33337C14.5526 3.58084 14.5038 3.826 14.4091 4.0548C14.3143 4.28361 14.1754 4.49162 14.0003 4.66671L5.00033 13.6667L1.33366 14.6667L2.33366 11L11.3337 2.00004Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        Edit
        </button>
    )}
    
    {canEdit && (
        <button 
        className={`${styles.soalBtn} ${styles.soalBtnDelete}`}
        onClick={() => onDelete(item)}
        aria-label={`Hapus ${item.title}`}
        >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M2 4H3.33333H14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M5.33333 4.00004V2.66671C5.33333 2.31309 5.47381 1.97395 5.72386 1.7239C5.97391 1.47385 6.31304 1.33337 6.66667 1.33337H9.33333C9.68696 1.33337 10.0261 1.47385 10.2761 1.7239C10.5262 1.97395 10.6667 2.31309 10.6667 2.66671V4.00004M12.6667 4.00004V13.3334C12.6667 13.687 12.5262 14.0261 12.2761 14.2762C12.0261 14.5262 11.687 14.6667 11.3333 14.6667H4.66667C4.31304 14.6667 3.97391 14.5262 3.72386 14.2762C3.47381 14.0261 3.33333 13.687 3.33333 13.3334V4.00004H12.6667Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M6.66667 7.33337V11.3334" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M9.33333 7.33337V11.3334" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        Hapus
        </button>
    )}
    
    <button
        onClick={() => onViewPDF(item)}
        className={`${styles.soalBtn} ${styles.soalBtnView}`}
        aria-label={`Buka PDF ${item.title}`}
    >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path d="M1.33334 8.00004C1.33334 8.00004 3.33334 3.33337 8.00001 3.33337C12.6667 3.33337 14.6667 8.00004 14.6667 8.00004C14.6667 8.00004 12.6667 12.6667 8.00001 12.6667C3.33334 12.6667 1.33334 8.00004 1.33334 8.00004Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M8 10C9.10457 10 10 9.10457 10 8C10 6.89543 9.10457 6 8 6C6.89543 6 6 6.89543 6 8C6 9.10457 6.89543 10 8 10Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        Buka PDF
    </button>
    </div>
</div>
);
});

SoalItem.displayName = 'SoalItem';

/* ================= MAIN LIST COMPONENT ================= */
function SoalList({ table, title }) {
const [user, setUser] = useState(null);
const [items, setItems] = useState([]);
const [loading, setLoading] = useState(true);
const [modalOpen, setModalOpen] = useState(false);
const [editData, setEditData] = useState(null);
const [saving, setSaving] = useState(false);

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;

useEffect(() => {
let mounted = true;

supabase.auth.getUser().then(({ data }) => {
    if (mounted) setUser(data.user);
});

return () => { mounted = false; };
}, []);

useEffect(() => {
if (!user || !table) return;

let mounted = true;

const fetchData = async () => {
    setLoading(true);
    
    const { data, error } = await supabase
    .from(table)
    .select(`
        *,
        profiles(username)
    `)
    .order('created_at', { ascending: false });
    
    if (error) {
    console.error('Error fetching data:', error);
    
    // ✅ Handle error 400 (foreign key missing)
    if (error.code === 'PGRST116' || error.message.includes('foreign key')) {
        Swal.fire({
        icon: 'error',
        title: 'Database Configuration Error',
        html: `
            <p>Relasi database belum dikonfigurasi dengan benar.</p>
            <p><small>Silakan hubungi administrator untuk menambahkan foreign key constraint.</small></p>
        `,
        confirmButtonColor: '#007bff'
        });
    }
    
    // Fallback: ambil data tanpa join jika error
    const { data: fallbackData } = await supabase
        .from(table)
        .select('*')
        .order('created_at', { ascending: false });
    
    if (mounted && fallbackData) {
        setItems(fallbackData.map(item => ({
        ...item,
        username: 'Pengguna'
        })));
    }
    } else if (mounted && data) {
    const flattenedData = data.map(item => ({
        ...item,
        username: item.profiles?.username || 'Pengguna'
    }));
    setItems(flattenedData || []);
    }
    
    if (mounted) {
    setLoading(false);
    }
};

fetchData();

return () => { mounted = false; };
}, [user, table]);

// ✅ FUNGSI UNTUK GENERATE URL YANG BENAR
const getPublicUrl = useCallback((filePath) => {
if (!filePath) return null;
return `${supabaseUrl}/storage/v1/object/public/documents/${filePath}`;
}, [supabaseUrl]);

// ✅ FUNGSI UNTUK VIEW PDF DENGAN ERROR HANDLING
const handleViewPDF = useCallback(async (item) => {
try {
    const pdfUrl = getPublicUrl(item.file_path);
    
    if (!pdfUrl) {
    Swal.fire({
        icon: 'error',
        title: 'File Tidak Ditemukan',
        text: 'Path file tidak valid',
        confirmButtonColor: '#007bff'
    });
    return;
    }

    // Test apakah file bisa diakses
    const response = await fetch(pdfUrl, { method: 'HEAD' });
    
    if (!response.ok) {
    Swal.fire({
        icon: 'error',
        title: 'File Tidak Dapat Diakses',
        html: `
        <p>File tidak dapat dibuka.</p>
        <small style="color: #666;">
            Status: ${response.status} ${response.statusText}
        </small>
        `,
        confirmButtonColor: '#007bff'
    });
    return;
    }

    // Buka di tab baru
    window.open(pdfUrl, '_blank', 'noopener,noreferrer');
    
} catch (error) {
    console.error('Error opening PDF:', error);
    Swal.fire({
    icon: 'error',
    title: 'Gagal Membuka PDF',
    text: 'Terjadi kesalahan saat membuka file. Silakan coba lagi.',
    confirmButtonColor: '#007bff'
    });
}
}, [getPublicUrl]);

const handleAddOrEdit = useCallback(async (payload) => {
try {
    setSaving(true);
    let filePath = payload.file_path;
    
    if (payload.pdfFile) {
    const fileExt = payload.pdfFile.name.split('.').pop();
    const timestamp = Date.now();
    const randomStr = Math.random().toString(36).substring(2, 8);
    const fileName = `${timestamp}_${randomStr}.${fileExt}`;
    
    // ✅ Upload ke folder public/{table}/
    const uploadPath = `${table}/${fileName}`;
    
    console.log('Uploading to path:', uploadPath);
    
    const { data, error } = await supabase.storage
        .from('documents')
        .upload(uploadPath, payload.pdfFile, {
        cacheControl: '3600',
        upsert: false
        });
    
    if (error) {
        console.error('Upload error:', error);
        if (error.message.includes('size')) {
        throw new Error('File terlalu besar. Maksimal 20MB');
        } else if (error.message.includes('policy')) {
        throw new Error('Tidak ada izin untuk upload. Hubungi administrator.');
        }
        throw error;
    }
    
    filePath = data.path;
    console.log('File uploaded to:', filePath);
    
    // Hapus file lama jika edit
    if (payload.file_path && payload.file_path !== filePath) {
        await supabase.storage
        .from('documents')
        .remove([payload.file_path]);
    }
    }
    
    const rawData = {
    title: payload.title,
    description: payload.description,
    file_path: filePath,
    user_id: user.id,
    };
    
    if (payload.id) {
    // Update
    const { error: updateError } = await supabase
        .from(table)
        .update(rawData)
        .eq('id', payload.id);
    
    if (updateError) throw updateError;
    
    const { data: profile } = await supabase
        .from('profiles')
        .select('username')
        .eq('id', user.id)
        .single();
    
    setItems(prev => prev.map(i => 
        i.id === payload.id 
        ? { ...i, ...rawData, username: profile?.username || 'Pengguna' } 
        : i
    ));
    } else {
    // Insert
    const { data: insertedData, error: insertError } = await supabase
        .from(table)
        .insert(rawData)
        .select()
        .single();
    
    if (insertError) throw insertError;
    
    const { data: profile } = await supabase
        .from('profiles')
        .select('username')
        .eq('id', user.id)
        .single();
    
    setItems(prev => [
        { ...insertedData, username: profile?.username || 'Pengguna' }, 
        ...prev
    ]);
    }
    
    Swal.fire({
    icon: 'success',
    title: 'Berhasil',
    text: 'Data materi berhasil disimpan',
    timer: 1500,
    showConfirmButton: false
    });
    
    setModalOpen(false);
    setEditData(null);
} catch (err) {
    console.error('Save error:', err);
    Swal.fire({
    icon: 'error',
    title: 'Gagal',
    text: err.message || 'Terjadi kesalahan',
    confirmButtonColor: '#007bff'
    });
} finally {
    setSaving(false);
}
}, [table, user]);

const handleDelete = useCallback(async (item) => {
const result = await Swal.fire({
    title: 'Hapus Materi?',
    html: `Apakah Anda yakin ingin menghapus:<br/><strong>${item.title}</strong>?<br/><br/>File PDF juga akan dihapus dari storage.`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#e74c3c',
    cancelButtonColor: '#6c757d',
    confirmButtonText: 'Ya, Hapus!',
    cancelButtonText: 'Batal',
    reverseButtons: true
});

if (result.isConfirmed) {
    try {
    const { error: storageError } = await supabase.storage
        .from('documents')
        .remove([item.file_path]);

    if (storageError) {
        console.error('Error deleting file from storage:', storageError);
    }

    const { error: dbError } = await supabase
        .from(table)
        .delete()
        .eq('id', item.id);

    if (dbError) throw dbError;

    setItems(prev => prev.filter(i => i.id !== item.id));

    Swal.fire({
        icon: 'success',
        title: 'Terhapus!',
        text: 'Materi berhasil dihapus',
        timer: 1500,
        showConfirmButton: false
    });
    } catch (err) {
    Swal.fire({
        icon: 'error',
        title: 'Gagal Menghapus',
        text: err.message || 'Terjadi kesalahan saat menghapus',
        confirmButtonColor: '#007bff'
    });
    }
}
}, [table]);

const handleOpenModal = useCallback((data = null) => {
setEditData(data);
setModalOpen(true);
}, []);

if (!user) {
return (
    <div className={styles.centered}>
    <p>Silakan login terlebih dahulu</p>
    </div>
);
}

return (
<>
    <LoadingScreen show={loading} />
    <div className={styles.soalSection}>
    <header className={styles.soalSectionHeader}>
    <div>
        <h2 className={styles.soalSectionTitle}>{title}</h2>
        <p className={styles.soalSectionSubtitle}>
        {items.length} materi tersedia
        </p>
    </div>
    <button 
        className={styles.addBtn} 
        onClick={() => handleOpenModal()}
        aria-label="Tambah materi baru"
    >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M12 5V19M5 12H19" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
    </button>
    </header>
    
    {loading ? (
    <div className={styles.soalGrid}>
        {[...Array(6)].map((_, i) => (
        <div key={i} className={`${styles.soalItem} ${styles.skeleton}`}>
            <div className={styles.skeletonText} />
            <div className={styles.skeletonText} style={{ width: '70%' }} />
        </div>
        ))}
    </div>
    ) : items.length === 0 ? (
    <div className={styles.emptyState}>
        <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
        <path d="M32 8V56M8 32H56" stroke="currentColor" strokeWidth="4" strokeLinecap="round"/>
        </svg>
        <h3>Belum Ada Materi</h3>
        <p>Mulai tambahkan {title.toLowerCase()} pertama Anda</p>
    </div>
    ) : (
    <div className={styles.soalGrid}>
        {items.map((item) => (
        <SoalItem
            key={item.id}
            item={item}
            onEdit={handleOpenModal}
            onDelete={handleDelete}
            onViewPDF={handleViewPDF}
            canEdit={item.user_id === user.id}
            currentUserId={user.id}
        />
        ))}
    </div>
    )}
    
    <AddEditSoalModal
    open={modalOpen}
    onClose={() => setModalOpen(false)}
    onSubmit={handleAddOrEdit}
    initialData={editData}
    loading={saving}
    />
</div>
</>
);
}

export default memo(SoalList);