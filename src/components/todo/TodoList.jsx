import { useEffect, useMemo, useState, useCallback } from 'react';
import styles from './Todo.module.css';
import { supabase } from '../../lib/supabase';

/* ================= HELPERS ================= */

const nowISO = () => new Date().toISOString().slice(0, 16);

function computeTimeLeft(ts) {
const diff = Math.floor((new Date(ts) - new Date()) / 1000);
const abs = Math.abs(diff);
const days = Math.floor(abs / 86400);
const hours = Math.floor((abs % 86400) / 3600);
const minutes = Math.floor((abs % 3600) / 60);
return { diff, days, hours, minutes };
}

/* ================= COMPONENT ================= */

export default function TodoList({ userId }) {
const [loading, setLoading] = useState(true);
const [tasks, setTasks] = useState([]);
const [editingId, setEditingId] = useState(null);

const [form, setForm] = useState({
title: '',
description: '',
deadline: nowISO(),
priority: 'normal'
});

/* ================= FETCH ================= */

const refreshTodos = useCallback(async () => {
if (!userId) return;

const { data, error } = await supabase
    .from('todos')
    .select('*')
    .eq('user_id', userId)
    .order('deadline', { ascending: true });

if (!error) setTasks(data || []);
}, [userId]);

useEffect(() => {
setLoading(true);
refreshTodos().finally(() => setLoading(false));
}, [refreshTodos]);

/* ================= FORM ================= */

const resetForm = useCallback(() => {
setForm({
    title: '',
    description: '',
    deadline: nowISO(),
    priority: 'normal'
});
setEditingId(null);
}, []);

const handleSubmit = async (e) => {
e.preventDefault();
if (!form.title.trim()) return;

const payload = {
    title: form.title.trim(),
    description: form.description.trim(),
    deadline: form.deadline,
    priority: form.priority,
    user_id: userId
};

if (editingId) {
    await supabase
    .from('todos')
    .update(payload)
    .eq('id', editingId);
} else {
    await supabase
    .from('todos')
    .insert(payload);
}

resetForm();
refreshTodos();
};

/* ================= ACTIONS ================= */

const handleDelete = async (id) => {
await supabase.from('todos').delete().eq('id', id);
refreshTodos();
};

const toggleDone = async (task) => {
await supabase
    .from('todos')
    .update({ done: !task.done })
    .eq('id', task.id);

refreshTodos();
};

const handleEdit = (task) => {
setEditingId(task.id);
setForm({
    title: task.title,
    description: task.description || '',
    deadline: task.deadline.slice(0, 16),
    priority: task.priority || 'normal'
});
window.scrollTo({ top: 0, behavior: 'smooth' });
};

/* ================= SORT ================= */

const sorted = useMemo(() => {
return [...tasks].sort(
    (a, b) => new Date(a.deadline) - new Date(b.deadline)
);
}, [tasks]);

/* ================= RENDER ================= */

return (
<div className={styles.container}>
    <header className={styles.header}>
    <h2 className={styles.title}>To-Do List</h2>
    <p className={styles.subtitle}>
        Tugas pribadi — tersimpan aman di akun Anda
    </p>
    </header>

    <form className={styles.form} onSubmit={handleSubmit}>
    <div className={styles.row}>
        <input
        className={styles.input}
        placeholder="Judul tugas"
        value={form.title}
        onChange={(e) =>
            setForm({ ...form, title: e.target.value })
        }
        required
        />

        <select
        className={styles.select}
        value={form.priority}
        onChange={(e) =>
            setForm({ ...form, priority: e.target.value })
        }
        >
        <option value="low">Normal</option>
        <option value="normal">Penting</option>
        <option value="high">Mendesak</option>
        </select>
    </div>

    <textarea
        className={styles.textarea}
        placeholder="Deskripsi (opsional)"
        value={form.description}
        onChange={(e) =>
        setForm({ ...form, description: e.target.value })
        }
        rows={3}
    />

    <div className={styles.row}>
        <label className={styles.fieldInline}>
        Deadline
        <input
            className={styles.input}
            type="datetime-local"
            value={form.deadline}
            onChange={(e) =>
            setForm({ ...form, deadline: e.target.value })
            }
            required
        />
        </label>

        <div className={styles.actions}>
        {editingId && (
            <button
            type="button"
            className={styles.btnGhost}
            onClick={resetForm}
            >
            Batal
            </button>
        )}
        <button type="submit" className={styles.btnPrimary}>
            {editingId ? 'Simpan' : 'Tambah Tugas'}
        </button>
        </div>
    </div>
    </form>

    <section className={styles.listSection}>
    {loading ? (
        <div className={styles.centered}>Memuat...</div>
    ) : sorted.length === 0 ? (
        <div className={styles.empty}>
        Belum ada tugas. Tambahkan tugas pertama Anda.
        </div>
    ) : (
        <ul className={styles.list}>
        {sorted.map((task) => {
            const { diff, days, hours, minutes } =
            computeTimeLeft(task.deadline);

            const isOverdue = diff < 0 && !task.done;
            const dueSoon =
            diff >= 0 && diff <= 86400 && !task.done;

            const cls = [
            styles.item,
            task.done && styles.done,
            isOverdue && styles.overdue,
            dueSoon && styles.dueSoon
            ]
            .filter(Boolean)
            .join(' ');

            const timeLabel = isOverdue
            ? `Terlambat ${Math.abs(days)}d ${Math.abs(hours)}j`
            : `${days}d ${hours}j ${minutes}m`;

            return (
            <li key={task.id} className={cls}>
                <div className={styles.itemTop}>
                <div>
                    <h4 className={styles.itemTitle}>
                    {task.title}
                    </h4>
                    <div className={styles.meta}>
                    <span className={styles.badge}>
                        {task.priority}
                    </span>
                    <small className={styles.timeLeft}>
                        {timeLabel}
                    </small>
                    </div>
                </div>

                <div className={styles.controls}>
                    <button
                    onClick={() => toggleDone(task)}
                    className={styles.iconBtn}
                    >
                    {task.done ? '↺' : '✓'}
                    </button>
                    <button
                    onClick={() => handleEdit(task)}
                    className={styles.iconBtn}
                    >
                    ✎
                    </button>
                    <button
                    onClick={() => handleDelete(task.id)}
                    className={styles.iconBtnDel}
                    >
                    🗑
                    </button>
                </div>
                </div>

                {task.description && (
                <p className={styles.itemDesc}>
                    {task.description}
                </p>
                )}
            </li>
            );
        })}
        </ul>
    )}
    </section>
</div>
);
}
