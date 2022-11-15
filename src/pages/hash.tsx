import { useState } from "react";
import bcryptjs from 'bcryptjs';

const Hashtrick = (props) => {
    const [hash, setHash] = useState<string>('');

    return (
        <div>
            <h1>Hash trick</h1>
            <input className="bg-red-500" onChange={(e) => {
                setHash(bcryptjs.hashSync(e.target.value));
            }}></input>
            <p>Hash: {hash}</p>
        </div>
    );
};
export default Hashtrick;
