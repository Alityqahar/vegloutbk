import React, { useState, useRef, useEffect } from 'react';
import styles from './SoalList.module.css';
import { supabase } from '../../lib/supabase';
import Swal from 'sweetalert2';

/* ================= MODAL ================= */

function AddEditSoalModal({ open, onClose, onSubmit, initialData, loading }) {
const [title, setTitle] = useState(initialData?.title || '');
const [description, setDescription] = useState(initialData?.description || '');
const [pdfFile, setPdfFile] = useState(null);
const fileInputRef = useRef(null);

useEffect(() => {
if (!open) return;

setTitle(initialData?.title ?? '');
setDescription(initialData?.description ?? '');
setPdfFile(null);

if (fileInputRef.current) {
    fileInputRef.current.value = '';
}
}, [open, initialData]);

const handleSubmit = async (e) => {
e.preventDefault();
if (!title || !description || (!pdfFile && !initialData)) return;

await onSubmit({
    id: initialData?.id,
    title,
    description,
    pdfFile,
    file_path: initialData?.file_path,
});
};

if (!open) return null;

return (
<div className={styles.modalBackdrop}>
    <div className={styles.modalContent}>
    <h3>{initialData ? 'Edit Soal/Materi' : 'Tambah Soal/Materi'}</h3>

    <form onSubmit={handleSubmit}>
        <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Judul"
        required
        />

        <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Deskripsi"
        required
        />

        <input
        type="file"
        accept="application/pdf"
        ref={fileInputRef}
        onChange={(e) => setPdfFile(e.target.files[0])}
        required={!initialData}
        />

        {(pdfFile || initialData?.file_path) && (
        <small>
            File: {pdfFile ? pdfFile.name : initialData.file_path.split('/').pop()}
        </small>
        )}

        <div>
        <button type="button" onClick={onClose} disabled={loading}>
            Batal
        </button>
        <button type="submit" disabled={loading}>
            {loading ? 'Menyimpan…' : 'Simpan'}
        </button>
        </div>
    </form>
    </div>
</div>
);
}

/* ================= LIST ================= */

export default function SoalList({ table = 'materi', title }) {
const [user, setUser] = useState(null);
const [items, setItems] = useState([]);
const [loadingItemId, setLoadingItemId] = useState(null);
const [modalOpen, setModalOpen] = useState(false);
const [editData, setEditData] = useState(null);
const [saving, setSaving] = useState(false);

/* ===== AUTH ===== */
useEffect(() => {
supabase.auth.getUser().then(({ data }) => {
    setUser(data.user);
});

const { data: listener } = supabase.auth.onAuthStateChange(
    (_event, session) => {
    setUser(session?.user ?? null);
    }
);

return () => listener.subscription.unsubscribe();
}, []);

/* ===== FETCH ===== */
useEffect(() => {
if (!user) return;

supabase
    .from(table)
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .then(({ data }) => setItems(data || []));
}, [user, table]);

/* ===== ADD / EDIT ===== */
const handleAddOrEdit = async (payload) => {
try {
    setSaving(true);
    let filePath = payload.file_path;

    if (payload.pdfFile) {
    const fileName = `${user.id}/${Date.now()}_${payload.pdfFile.name}`;
    const { data } = await supabase.storage
        .from(table)
        .upload(fileName, payload.pdfFile, { upsert: true });

    filePath = data.path;
    }

    if (payload.id) {
    await supabase
        .from(table)
        .update({
        title: payload.title,
        description: payload.description,
        file_path: filePath,
        })
        .eq('id', payload.id);

    setItems(items =>
        items.map(i => i.id === payload.id ? { ...i, ...payload, file_path: filePath } : i)
    );
    } else {
    const { data } = await supabase
        .from(table)
        .insert({
        title: payload.title,
        description: payload.description,
        file_path: filePath,
        user_id: user.id,
        })
        .select()
        .single();

    setItems(items => [data, ...items]);
    }

    Swal.fire('Berhasil', 'Data disimpan', 'success');
    setModalOpen(false);
    setEditData(null);
} catch {
    Swal.fire('Gagal', 'Terjadi kesalahan', 'error');
} finally {
    setSaving(false);
}
};

if (!user) return <p>Silakan login</p>;

return (
<>
    <h2>{title}</h2>
    <button onClick={() => setModalOpen(true)}>+</button>

    {items.map(item => (
    <div key={item.id}>
        <b>{item.title}</b>
        <button
        disabled={loadingItemId === item.id}
        onClick={() => { setEditData(item); setModalOpen(true); }}
        >
        Edit
        </button>
    </div>
    ))}

    <AddEditSoalModal
    open={modalOpen}
    onClose={() => setModalOpen(false)}
    onSubmit={handleAddOrEdit}
    initialData={editData}
    loading={saving}
    />
</>
);
}
