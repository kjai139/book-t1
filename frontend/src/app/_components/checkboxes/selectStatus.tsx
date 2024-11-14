import { CheckboxGroup, Checkbox } from "@nextui-org/react";


export default function SelectStatusCheckbox ({value, setValue, isDisabled}:any) {
    return (
        <div>
            <CheckboxGroup isDisabled={isDisabled} label="By Status" value={value} onValueChange={setValue} orientation="horizontal" className="gap-4 mt-2" classNames={{
                wrapper: 'qlabel'
            }}>
                <Checkbox value={"663aa1c2c4d589dfd10a3384"}>Ongoing</Checkbox>
                <Checkbox value={"663aa1c2c4d589dfd10a3385"}>Finished</Checkbox>
                <Checkbox value={"663aa1c2c4d589dfd10a3386"}>Hiatus</Checkbox>
            </CheckboxGroup>
            
        </div>
    )
}