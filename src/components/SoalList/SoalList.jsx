import { memo, useState, useRef, useEffect, useCallback } from 'react';
import styles from './SoalList.module.css';
import { supabase } from '../../lib/supabase';
import Swal from 'sweetalert2';

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

// Validasi file size (max 5MB)
if (pdfFile && pdfFile.size > 5 * 1024 * 1024) {
    Swal.fire({
    icon: 'warning',
    title: 'File Terlalu Besar',
    text: 'Ukuran file maksimal 5MB',
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
            <span className={styles.fileName}>{pdfFile.name}</span>
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
const SoalItem = memo(({ item, onEdit, supabaseUrl, canEdit, currentUserId }) => (
    <div className={styles.soalItem}>
        <div className={styles.soalInfo}>
        <h4 className={styles.soalTitle}>{item.title}</h4>
        <p className={styles.soalDesc}>{item.description}</p>
        
        {/* Tambahkan info pemilik jika bukan milik user saat ini */}
        {item.user_id !== currentUserId && (
            <span className={styles.ownerBadge}>
            📤 Dibagikan oleh pengguna lain
            </span>
        )}
        </div>
        <div className={styles.soalActions}>
        {/* Tombol Edit hanya muncul jika user adalah pemilik */}
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
        <a 
            href={`${supabaseUrl}/storage/v1/object/public/documents/${item.file_path}`}
            target="_blank" 
            rel="noreferrer noopener"
            className={`${styles.soalBtn} ${styles.soalBtnView}`}
            aria-label={`Buka PDF ${item.title}`}
        >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M1.33334 8.00004C1.33334 8.00004 3.33334 3.33337 8.00001 3.33337C12.6667 3.33337 14.6667 8.00004 14.6667 8.00004C14.6667 8.00004 12.6667 12.6667 8.00001 12.6667C3.33334 12.6667 1.33334 8.00004 1.33334 8.00004Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M8 10C9.10457 10 10 9.10457 10 8C10 6.89543 9.10457 6 8 6C6.89543 6 6 6.89543 6 8C6 9.10457 6.89543 10 8 10Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Buka PDF
        </a>
        </div>
    </div>
));

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

// Fetch data
    useEffect(() => {
    if (!user || !table) return;

    let mounted = true;

    const fetchData = async () => {
        setLoading(true);
        const { data, error } = await supabase
        .from(table)
        .select('*')
        // .eq('user_id', user.id)  ← DIHAPUS agar semua data tampil
        .order('created_at', { ascending: false });
        
        if (mounted && !error) {
        setItems(data || []);
        }
        if (mounted) {
        setLoading(false);
        }
    };

    fetchData();

    return () => { mounted = false; };
    }, [user, table]);

const handleAddOrEdit = useCallback(async (payload) => {
try {
    setSaving(true);
    let filePath = payload.file_path;
    
    // Upload file jika ada
    if (payload.pdfFile) {
    const fileExt = payload.pdfFile.name.split('.').pop();
    const fileName = `${table}_${Date.now()}.${fileExt}`;
    const uploadPath = `${user.id}/${fileName}`;
    
    const { data, error } = await supabase.storage
        .from('documents')
        .upload(uploadPath, payload.pdfFile);
    
    if (error) throw error;
    filePath = data.path;
    }
    
    const rawData = {
    title: payload.title,
    description: payload.description,
    file_path: filePath,
    user_id: user.id,
    };
    
    if (payload.id) {
    // Update
    await supabase.from(table).update(rawData).eq('id', payload.id);
    setItems(prev => prev.map(i => i.id === payload.id ? { ...i, ...rawData } : i));
    } else {
    // Insert
    const { data } = await supabase.from(table).insert(rawData).select().single();
    setItems(prev => [data, ...prev]);
    }
    
    Swal.fire({
    icon: 'success',
    title: 'Berhasil',
    text: 'Data materi berhasil diperbarui',
    timer: 1500,
    showConfirmButton: false
    });
    
    setModalOpen(false);
    setEditData(null);
} catch (err) {
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
        supabaseUrl={supabaseUrl}
        canEdit={item.user_id === user.id}  // ✅ Tambahkan prop ini
        currentUserId={user.id}              // ✅ Tambahkan prop ini
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
);
}

export default memo(SoalList);