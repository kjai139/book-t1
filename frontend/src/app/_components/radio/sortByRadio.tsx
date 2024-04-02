import { RadioGroup, Radio } from "@nextui-org/react";


export default function SortByRadio ({value, setValue}) {

    return (
        <RadioGroup label="Sort by" value={value} onValueChange={setValue} orientation="horizontal">
            <Radio value={"latest"}>Latest</Radio>
            <Radio value={"rating"}>Rating</Radio>
            

        </RadioGroup>
    )
}