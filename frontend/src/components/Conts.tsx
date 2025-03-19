import { JSX } from "react";

export function ImgCont({ path = "./src/assets/react.svg", alt = "image" }: { path?: string; alt?: string }) {
    return (
        <div className="container my-3 text-center" style={{ padding: "20px", height: "20vh", overflow: "auto", border: "1px solid", borderRadius: "20px" }}>
            <img src={path} alt={alt} height="100%" />
        </div>
    );
}

export function ScrollCont({ els }: { els: JSX.Element[] }) {
    return (
        <div className="container my-3 text-center" style={{ padding: "20px", height: "20vh", overflow: "auto", border: "1px solid", borderRadius: "20px" }}>
            {els.map((el, idx) => (
                <div key={idx}>{el}</div>
            ))}
        </div>
    );
}