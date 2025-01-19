import React from 'react';

interface Props {
    style: React.CSSProperties;
}

function CustomProducts({ style }: Props) {
    return (
        <>
            <div id="custom" className="section" style={style}>
                <div className="row" style={{ alignItems: 'end' }}>
                    <div className="col-lg-7 col-md-12">
                    <h1 className="text-center mb-4" style={{ fontSize: '40px' }}>Chỉ có 1 trên đời</h1>
                    <p className="mb-4" style={{ fontSize: '27px', paddingLeft: '10px' }}>
                        Tự custom một chiếc vòng tay, móc khóa, dây chuyền hay phone strap mà khỏi lo đụng hàng.
                    </p>
                    </div>
                </div>
            </div>
        </>
    );
};

export default CustomProducts;
