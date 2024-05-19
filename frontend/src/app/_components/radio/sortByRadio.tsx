import { RadioGroup, Radio } from "@nextui-org/react";



export default function SortByRadio ({value, setValue}:any) {

    return (
        <RadioGroup label="Sort by" value={value} onValueChange={setValue} className="p-2" orientation="horizontal" defaultValue={value} classNames={{
            wrapper: 'qlabel'
        }}>
            <Radio value={"latest"}>Latest</Radio>
            <Radio value={"rating"}>Rating</Radio>
            

        </RadioGroup>
    )
}