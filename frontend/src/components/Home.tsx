import { ImgCont, ScrollCont, } from "./Conts"
export default function Home() {
    return (

        <div className="container">
            <div className="row">
                <div className="col-md-6">
                    <ImgCont />
                </div>
                <div className="col-md-6">
                    <ScrollCont els={[
                        <div key="1">Element 1</div>,
                        <div key="2">Element 2</div>,
                        <div key="3">Element 3</div>
                    ]} />
                </div>
            </div>
            <div className="row">
                <div className="col-md-6">
                    <ScrollCont els={[
                        <div key="1">Element 1</div>,
                        <div key="2">Element 2</div>,
                        <div key="2">Element 2</div>,
                        <div key="2">Element 2</div>,
                        <div key="3">Element 3</div>
                    ]} />
                </div>
                <div className="col-md-6">
                    <ImgCont alt="Img" />
                </div>
            </div>
        </div>
    );
}