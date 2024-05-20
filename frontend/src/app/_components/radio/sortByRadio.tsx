import { RadioGroup, Radio } from "@nextui-org/react";



export default function SortByRadio ({value, setValue, isDisabled}:any) {

    return (
        <RadioGroup isDisabled={isDisabled} label="Sort by" value={value} onValueChange={setValue} className="p-2" orientation="horizontal" defaultValue={value} classNames={{
            wrapper: 'qlabel'
        }}>
            <Radio value={"latest"}>Latest</Radio>
            <Radio value={"rating"}>Rating</Radio>
            

        </RadioGroup>
    )
}