import React from 'react';

interface Props {
    style: React.CSSProperties;
}

function BakeProducts({ style }: Props) {
    return (
        <>
            <div id="bake" className="products section" style={style}>
                <div className="container text-center">
                    <img
                    style={{
                        width: '50px',
                        height: 'auto',
                        margin: '0 auto',
                        maxWidth: '100%',
                    }}
                    id="imgur"
                    src="https://media.tenor.com/On7kvXhzml4AAAAj/loading-gif.gif"
                    alt="Loading"
                    />
                </div>
            </div>
        </>
    );
};

export default BakeProducts;
