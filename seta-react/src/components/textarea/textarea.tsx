import { useState } from 'react';
import { InputTextarea } from 'primereact';

const TextareaInput = () => {
    const [value1, setValue1] = useState('');

    return (
        <div>
            <InputTextarea placeholder="Paste text here ..." value={value1} onChange={(e) => setValue1(e.target.value)} rows={5} cols={100} />
        </div>
    )
}
export default TextareaInput;