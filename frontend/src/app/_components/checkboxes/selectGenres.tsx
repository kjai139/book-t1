
import {CheckboxGroup, Checkbox} from "@nextui-org/react";



export default function SelectGenres ({value, setValue, allGenres, isDisabled}:any) {

    



    return (
       <div className="flex w-full flex-col gap-2">
             { allGenres &&
             <>
             <CheckboxGroup
             label="By Genres"
             color="primary"
             value={value}
             isDisabled={isDisabled}
             onValueChange={setValue}
             classNames={{
                wrapper: 'qlabel'
             }}
             >
                {allGenres.map((node:any, idx:number) => {
                return (
                    <Checkbox key={`check-${idx}`} value={node._id}>{node.name}</Checkbox>
                )
             })}
             </CheckboxGroup>
             
            {/*  <p>Selected: {value.join(', ')}</p> */}
            </>
            }
        </div>
    )
}