import { RadioGroup, Radio } from "@nextui-org/react";



export default function SortByRadio ({value, setValue}:any) {

    return (
        <RadioGroup label="Sort by" value={value} onValueChange={setValue} orientation="horizontal" defaultValue={value}>
            <Radio value={"latest"}>Latest</Radio>
            <Radio value={"rating"}>Rating</Radio>
            

        </RadioGroup>
    )
}