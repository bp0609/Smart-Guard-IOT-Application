export default function Dropdown({ title, items, onSelect, disabled, disable_msg = "Disabled" }: { title: string; items: string[]; onSelect: (item: string) => void; disabled?: boolean, disable_msg?: string }) {
    if (disabled) {
        return (
            <div className="btn-group">
                <button type="button" className="btn btn-secondary" style={{ width: "200px" }}>{title}</button>
                <button type="button" className="btn btn-secondary dropdown-toggle dropdown-toggle-split" data-bs-toggle="dropdown" aria-expanded="false" data-bs-reference="parent">
                    <span className="visually-hidden">Toggle Dropdown</span>
                </button>
                <ul className="dropdown-menu">
                    <li>
                        <button className="dropdown-item" disabled>{disable_msg}</button>
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
            <ul className="dropdown-menu">
                {items.map((item, idx) => (
                    <li key={idx}>
                        <button className="dropdown-item" onClick={() => onSelect(item)}>{item}</button>
                    </li>
                ))}
            </ul>
        </div>
    );
}