import React, { useState, useRef } from 'react';
import styles from './SoalList.module.css';

function AddSoalModal({ open, onClose, onSubmit }) {
const [title, setTitle] = useState('');
const [description, setDescription] = useState('');
const [pdfFile, setPdfFile] = useState(null);
const fileInputRef = useRef();

const handleSubmit = (e) => {
    e.preventDefault();
    if (!title || !description || !pdfFile) return;
    onSubmit({
    id: Date.now(),
    title,
    description,
    pdfUrl: URL.createObjectURL(pdfFile)
    });
    setTitle('');
    setDescription('');
    setPdfFile(null);
    fileInputRef.current.value = '';
    onClose();
};

if (!open) return null;
return (
    <div className={styles.modalBackdrop}>
    <div className={styles.modalContent}>
        <h3 className={styles.modalTitle}>Tambah Soal Baru</h3>
        <form className={styles.modalForm} onSubmit={handleSubmit}>
        <label>
            Judul Soal
            <input
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            required
            className={styles.input}
            placeholder="Masukkan judul soal"
            />
        </label>
        <label>
            Deskripsi
            <textarea
            value={description}
            onChange={e => setDescription(e.target.value)}
            required
            className={styles.textarea}
            placeholder="Deskripsi lengkap soal"
            rows={4}
            />
        </label>
        <label>
            File PDF
            <input
            type="file"
            accept="application/pdf"
            ref={fileInputRef}
            onChange={e => setPdfFile(e.target.files[0])}
            required
            className={styles.input}
            />
        </label>
        <div className={styles.modalActions}>
            <button
            type="button"
            className={styles.modalBtnCancel}
            onClick={onClose}
            >
            Batal
            </button>
            <button type="submit" className={styles.modalBtnSubmit}>
            Simpan
            </button>
        </div>
        </form>
    </div>
    </div>
);
}

export default function SoalList({ items = [], title, containerStyle = {}, onAdd }) {
const [modalOpen, setModalOpen] = useState(false);

return (
    <section className={styles.soalSection} style={containerStyle}>
    <div className={styles.soalSectionHeader}>
        {title && <h2 className={styles.soalSectionTitle}>{title}</h2>}
        <button
        className={styles.addBtn}
        title="Tambah Soal"
        onClick={() => setModalOpen(true)}
        >
        <span className={styles.addIcon}>+</span>
        </button>
    </div>
    <div className={styles.soalGrid}>
        {items.map((item, idx) => (
        <div className={styles.soalItem} key={item.id || idx}>
            <div className={styles.soalInfo}>
            <div className={styles.soalTitle}>{item.title}</div>
            <div className={styles.soalDesc}>{item.description}</div>
            </div>
            <a
            href={item.pdfUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.soalBtn}
            >
            Unduh
            </a>
        </div>
        ))}
    </div>
    <AddSoalModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={onAdd || (() => {})}
    />
    </section>
);
}

// Dummy data example for development/demo
export function SoalListDemo() {
const [soalList, setSoalList] = useState([
{
    id: 1,
    title: 'Soal Penalaran Umum 2024',
    description: 'Latihan soal penalaran umum UTBK terbaru.',
    pdfUrl: '/pdf/penalaran-umum-2024.pdf',
},
{
    id: 2,
    title: 'Soal Pengetahuan Kuantitatif',
    description: 'Kumpulan soal matematika dasar dan logika.',
    pdfUrl: '/pdf/pengetahuan-kuantitatif.pdf'
},
{
    id: 3,
    title: 'Soal Literasi Bahasa Indonesia',
    description: 'Soal literasi dan pemahaman bacaan bahasa Indonesia.',
    pdfUrl: '/pdf/literasi-bahasa-indonesia.pdf'
},
{
    id: 4,
    title: 'Soal Penalaran Matematika',
    description: 'Soal penalaran matematika untuk UTBK.',
    pdfUrl: '/pdf/penalaran-matematika.pdf'
},
{
    id: 5,
    title: 'Soal Literasi Bahasa Inggris',
    description: 'Soal literasi bahasa Inggris UTBK.',
    pdfUrl: '/pdf/literasi-bahasa-inggris.pdf'
},
{
    id: 6,
    title: 'Soal Pengetahuan Umum',
    description: 'Soal pengetahuan umum dan wawasan kebangsaan.',
    pdfUrl: '/pdf/pengetahuan-umum.pdf'
}
]);

const handleAddSoal = (newSoal) => {
    setSoalList(prev => [newSoal, ...prev]);
};

return (
    <SoalList
    title="Daftar Soal UTBK"
    items={soalList}
    containerStyle={{ maxWidth: 1100, padding: '100px 16px 40px', margin: '0 auto' }}
    onAdd={handleAddSoal}
    />
);
}
