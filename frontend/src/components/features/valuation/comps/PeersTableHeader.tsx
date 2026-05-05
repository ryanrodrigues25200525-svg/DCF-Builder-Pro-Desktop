export const PeersTableHeader = () => {
    return (
        <thead className="sticky top-0 z-10">
            <tr className="bg-(--bg-glass) dark:bg-white/4">
                <th className="w-16 border-b border-(--border-default) px-5 py-6 text-left text-[13px] font-black uppercase tracking-[0.18em] text-(--text-secondary) dark:border-white/10 dark:text-white/70">Sel</th>
                <th className="border-b border-(--border-default) px-5 py-6 text-left text-[13px] font-black uppercase tracking-[0.18em] text-(--text-secondary) dark:border-white/10 dark:text-white/70">Company</th>
                <th className="border-b border-(--border-default) px-5 py-6 text-right text-[13px] font-black uppercase tracking-[0.18em] text-(--text-secondary) dark:border-white/10 dark:text-white/70">Price</th>
                <th className="w-32 border-b border-(--border-default) px-5 py-6 text-center text-[13px] font-black uppercase tracking-[0.18em] text-(--text-secondary) dark:border-white/10 dark:text-white/70">52W Trend</th>
                <th className="border-b border-(--border-default) px-5 py-6 text-right text-[13px] font-black uppercase tracking-[0.18em] text-(--text-secondary) dark:border-white/10 dark:text-white/70">Mkt Cap</th>
                <th className="border-b border-(--border-default) px-5 py-6 text-right text-[13px] font-black uppercase tracking-[0.18em] text-(--text-secondary) dark:border-white/10 dark:text-white/70">EV</th>
                <th className="border-b border-(--border-default) px-5 py-6 text-right text-[13px] font-black uppercase tracking-[0.18em] text-sky-500 dark:border-white/10 dark:text-sky-300">EV/Rev</th>
                <th className="border-b border-(--border-default) px-5 py-6 text-right text-[13px] font-black uppercase tracking-[0.18em] text-indigo-500 dark:border-white/10 dark:text-indigo-300">EV/EBITDA</th>
                <th className="border-b border-(--border-default) px-5 py-6 text-right text-[13px] font-black uppercase tracking-[0.18em] text-(--text-secondary) dark:border-white/10 dark:text-white/70">Rev Grw</th>
                <th className="border-b border-(--border-default) px-5 py-6 text-right text-[13px] font-black uppercase tracking-[0.18em] text-(--text-secondary) dark:border-white/10 dark:text-white/70">EBITDA Mgn</th>
                <th className="border-b border-(--border-default) px-5 py-6 text-right text-[13px] font-black uppercase tracking-[0.18em] text-(--text-secondary) dark:border-white/10 dark:text-white/70">Beta</th>
                <th className="border-b border-(--border-default) px-5 py-6 text-right text-[13px] font-black uppercase tracking-[0.18em] text-(--text-secondary) dark:border-white/10 dark:text-white/70">Qual Score</th>
            </tr>
        </thead>
    );
};
