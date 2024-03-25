import { CheckboxGroup, Checkbox } from "@nextui-org/react";


export default function SelectStatusCheckbox ({value, setValue}) {
    return (
        <div>
            <CheckboxGroup label="By Status" value={value} onValueChange={setValue} orientation="horizontal">
                <Checkbox value={"Ongoing"}>Ongoing</Checkbox>
                <Checkbox value={"Completed"}>Completed</Checkbox>
                <Checkbox value={"Hiatus"}>Hiatus</Checkbox>
            </CheckboxGroup>
            {/* {value && <p>Selected: {value.join(', ')}</p>} */}
        </div>
    )
}