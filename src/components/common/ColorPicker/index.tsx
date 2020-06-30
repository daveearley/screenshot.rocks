import React, {useState} from 'react'
import {RGBColor, SketchPicker} from 'react-color'
import {styles} from "./styles";
import {hex2rgba} from "../../../utils/image";

interface IColorPickerProps {
    initialColor: string;
    onColorChange: ((color: RGBColor) => {});
}

export const ColorPicker = ({initialColor, onColorChange}: IColorPickerProps) => {
    const [displayColorPicker, setDisplayColorPicker] = useState(false);
    const [color, setColor] = useState<RGBColor>(hex2rgba(initialColor))

    const handleClick = () => {
        setDisplayColorPicker(!displayColorPicker);
    };

    const handleClose = () => {
        setDisplayColorPicker(false)
    };

    const handleChange = (color: any) => {
        setColor(color.rgb)
        onColorChange(color.rgb);
    };

    return (
        <div className={styles(color)}>
            <div className="swatch" onClick={handleClick}>
                <div className="color"/>
            </div>
            {displayColorPicker ?
                <div className="popup">
                    <div className="cover" onClick={handleClose}/>
                    <SketchPicker color={color} onChange={handleChange}/>
                </div> : null}
        </div>
    );
}