
import { useRef,useEffect,forwardRef, useImperativeHandle } from "react"

const Modal = forwardRef( function Modal({modalOnConfirm,modalOnCancel},ref)
{
    // useEffect(()=>{   dialogRef.current.showModal();},[])
    const dialogRef = useRef()

    useImperativeHandle(ref,()=>
    {
        return {
            open() {
                dialogRef.current.showModal();

            },
            close()
            {
                dialogRef.current.close()
            }
        }
    });

 
    return (
    <dialog ref={dialogRef} className="w-96 px-8 py-4 rounded bg-white">
        <div className="p-4">
            <div>
                The measurement exceeds length 90
            </div>
            <div>
                <div className="pt-4 text">
                    <button className="px-2 py-1 rounded mr-4" onClick={modalOnCancel}>Cancel</button>
                    <button className="px-2 py-1 rounded border-2 bg-gray-300" onClick={modalOnConfirm}>Confirm</button>
                </div>
            </div>

        </div>
    </dialog>
    )
}

)

export default Modal