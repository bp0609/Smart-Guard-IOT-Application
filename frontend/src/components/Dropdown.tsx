export default function Dropdown({ title, items, onSelect, disabled, disable_msg = "Disabled", mode = 'light' }: { title: string; items: string[]; onSelect: (item: string) => void; disabled?: boolean, disable_msg?: string, mode?: 'light' | 'dark' }) {

    const modeClass = mode === 'light' ? 'custom-light' : 'custom-dark';
    if (disabled) {
        return (
            <div className="btn-group">
                <button type="button" className="btn btn-secondary" style={{ width: "200px" }}>{title}</button>
                <button type="button" className="btn btn-secondary dropdown-toggle dropdown-toggle-split" data-bs-toggle="dropdown" aria-expanded="false" data-bs-reference="parent">
                    <span className="visually-hidden">Toggle Dropdown</span>
                </button>
                <ul className={`dropdown-menu bg-${mode === 'light' ? 'light' : 'dark'} text-${mode === 'light' ? 'dark' : 'light'}`}>
                    <li>
                        <button className={`dropdown-item ${modeClass}`} disabled>{disable_msg}</button>
                    </li>
                </ul>
            </div>
        );
    }
    return (
        <div className="btn-group">
            <button type="button" className="btn btn-secondary" style={{ width: "200px" }}>{title}</button>
            <button type="button" className="btn btn-secondary dropdown-toggle dropdown-toggle-split" data-bs-toggle="dropdown" aria-expanded="false" data-bs-reference="parent">
                <span className="visually-hidden">Toggle Dropdown</span>
            </button>
            <ul className={`dropdown-menu bg-${mode === 'light' ? 'light' : 'dark'} text-${mode === 'light' ? 'dark' : 'light'}`}>
                {items.map((item, idx) => (
                    <li key={idx}>
                        <button className={`dropdown-item ${modeClass}`} onClick={() => onSelect(item)}>{item}</button>
                    </li>
                ))}
            </ul>
        </div>
    );
}