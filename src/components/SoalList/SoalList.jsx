import React, { useState, useRef, useEffect } from 'react';
import styles from './SoalList.module.css';
import { supabase } from '../../lib/supabase';
import Swal from 'sweetalert2';

/* ================= MODAL COMPONENT ================= */
function AddEditSoalModal({ open, onClose, onSubmit, initialData, loading }) {
const [title, setTitle] = useState('');
const [description, setDescription] = useState('');
const [pdfFile, setPdfFile] = useState(null);
const fileInputRef = useRef(null);

useEffect(() => {
if (open) {
    setTitle(initialData?.title || '');
    setDescription(initialData?.description || '');
    setPdfFile(null);
}
}, [open, initialData]);

if (!open) return null;

const handleSubmit = (e) => {
e.preventDefault();
onSubmit({
    id: initialData?.id,
    title,
    description,
    pdfFile,
    file_path: initialData?.file_path,
});
};

return (
<div className={styles.modalBackdrop} onClick={onClose}>
    <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
    <h3 className={styles.modalTitle}>
        {initialData ? 'Edit Materi' : 'Tambah Materi Baru'}
    </h3>
    <form onSubmit={handleSubmit} className={styles.modalForm}>
        <input
        className={styles.input}
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Judul Materi (contoh: Latihan Aritmatika)"
        required
        />
        <textarea
        className={styles.textarea}
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Deskripsi singkat..."
        required
        />
        <div className={styles.fileUploadSection}>
        <label>File PDF {initialData && '(Opsional jika tidak ganti)'}</label>
        <input
            type="file"
            className={styles.input}
            accept="application/pdf"
            ref={fileInputRef}
            onChange={(e) => setPdfFile(e.target.files[0])}
            required={!initialData}
        />
        </div>

        <div className={styles.modalActions}>
        <button type="button" className={styles.modalBtnCancel} onClick={onClose} disabled={loading}>
            Batal
        </button>
        <button type="submit" className={styles.modalBtnSubmit} disabled={loading}>
            {loading ? 'Menyimpan...' : 'Simpan Materi'}
        </button>
        </div>
    </form>
    </div>
</div>
);
}

/* ================= MAIN LIST COMPONENT ================= */
export default function SoalList({ table, title }) {
const [user, setUser] = useState(null);
const [items, setItems] = useState([]);
const [loading, setLoading] = useState(true);
const [modalOpen, setModalOpen] = useState(false);
const [editData, setEditData] = useState(null);
const [saving, setSaving] = useState(false);

useEffect(() => {
supabase.auth.getUser().then(({ data }) => setUser(data.user));
}, []);

// Ambil data berdasarkan prop 'table' yang dipassing
useEffect(() => {
if (!user || !table) return;

const fetchData = async () => {
    setLoading(true);
    const { data, error } = await supabase
    .from(table)
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

    if (!error) setItems(data || []);
    setLoading(false);
};

fetchData();
}, [user, table]);

const handleAddOrEdit = async (payload) => {
try {
    setSaving(true);
    let filePath = payload.file_path;

    // Logic Upload ke Folder sesuai Nama Tabel agar tidak campur
    if (payload.pdfFile) {
    const fileExt = payload.pdfFile.name.split('.').pop();
    const fileName = `${user.id}/${Date.now()}.${fileExt}`;
    const { data, error } = await supabase.storage
        .from('documents') // Gunakan 1 bucket utama 'documents'
        .upload(`${table}/${fileName}`, payload.pdfFile); // Sub-folder sesuai tabel

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
    await supabase.from(table).update(rawData).eq('id', payload.id);
    setItems(prev => prev.map(i => i.id === payload.id ? { ...i, ...rawData } : i));
    } else {
    const { data } = await supabase.from(table).insert(rawData).select().single();
    setItems(prev => [data, ...prev]);
    }

    Swal.fire('Berhasil', 'Data materi berhasil diperbarui', 'success');
    setModalOpen(false);
    setEditData(null);
} catch (err) {
    Swal.fire('Gagal', err.message || 'Terjadi kesalahan', 'error');
} finally {
    setSaving(false);
}
};

if (!user) return <div className={styles.centered}>Silakan login terlebih dahulu</div>;

return (
<div className={styles.soalSection}>
    <header className={styles.soalSectionHeader}>
    <h2 className={styles.soalSectionTitle}>{title}</h2>
    <button className={styles.addBtn} onClick={() => { setEditData(null); setModalOpen(true); }}>
        <span className={styles.addIcon}>+</span>
    </button>
    </header>

    {loading ? (
    <p>Memuat data...</p>
    ) : (
    <div className={styles.soalGrid}>
        {items.map((item) => (
        <div key={item.id} className={styles.soalItem}>
            <div className={styles.soalInfo}>
            <h4 className={styles.soalTitle}>{item.title}</h4>
            <p className={styles.soalDesc}>{item.description}</p>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
            <button 
                className={styles.soalBtn} 
                onClick={() => { setEditData(item); setModalOpen(true); }}
            >
                Edit
            </button>
            <a 
                href={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/documents/${item.file_path}`}
                target="_blank" 
                rel="noreferrer" 
                className={styles.soalBtn}
                style={{ background: '#6c757d' }}
            >
                Buka PDF
            </a>
            </div>
        </div>
        ))}
    </div>
    )}

    {items.length === 0 && !loading && (
    <p style={{ textAlign: 'center', color: '#888', marginTop: '2rem' }}>Belum ada materi di subtest ini.</p>
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