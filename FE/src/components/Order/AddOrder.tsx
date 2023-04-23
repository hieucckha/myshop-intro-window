import { useAppDispatch, useAppSelector } from '@/Hooks/apphooks';
import { IOrderDetailProduct } from '@/interfaces/Order';
import React, { useEffect, useState } from 'react'
import { addProductToCurrentOrder, removeProductToCurrentOrder } from './OrderSlice';
import { RootState } from '@/store';
import { getDetailBook } from './OrderDashBoard';
import Select from 'react-select'
import { BookOption } from '@/interfaces/bookDetail';
import { NumericFormat } from 'react-number-format';
import AddCustomToOrder from '../Customer/AddCustomToOrder';
// const options = [
//     { value: 'chocolate', label: 'Chocolate' },
//     { value: 'strawberry', label: 'Strawberry' },
//     { value: 'vanilla', label: 'Vanilla' }
// ]
export default function AddOrder() {
    const listBook = useAppSelector((state: RootState) => state.book.listAllBook)
    const listProduct = useAppSelector((state: RootState) => state.order.currentOrder)
    const [books, setBooks] = useState<IOrderDetailProduct[]>(listProduct)
    const [selected, setSelected] = useState<BookOption|null>(null);
    const [options, setOptions] = useState<BookOption[]>([]);
    const quantityRef = React.useRef<HTMLInputElement>(null);
    
    const dispatch = useAppDispatch()
    console.log(listProduct)
    console.log(books)
    useEffect(() => {
        console.log("change")
        const temp = getDetailBook(listProduct, listBook)
        setBooks(temp);
    }, [listProduct])
    const handleAdd = () => {
        console.log(selected)
        if(selected!=null && quantityRef.current && quantityRef.current.value){
            console.log("push")
            const newProduct :IOrderDetailProduct ={
                productId: selected.value,
                quantity: parseInt(quantityRef.current?.value),
                title: selected.label
            }
            console.log(newProduct)
            dispatch(addProductToCurrentOrder(newProduct))
        }
        
    }
    const handleChange = (selectedOption:any) => {
        setSelected(selectedOption);
        console.log(`Option selected:`, selectedOption);
      };
    const HandleDelete = (id: Number) => {
        if (id) {
            dispatch(removeProductToCurrentOrder({ id }))
        }
    }

    useEffect(() => {
        console.log("catelist multy")
        const changeOption = async () => {
            const newoptions: BookOption[] = [];
            listBook.map(book => {
                newoptions.push({ label: book.title, value: book.id })
            })
            setOptions(newoptions)
            // setSelected(storeSelected)
        }
        changeOption();
    }, [listBook])
    return (
        <div className="add-order" style={{ height: "100vh" }}>
            <div className='row' >
                <div className='box-add-product align-items-center d-flex justify-content-center flex-column col'>
                    <span><strong style={{fontSize:"28px"}}>Sách được mua</strong></span>
                    <table className="table scrolldown">
                        <thead className="thead-light" style={{backgroundColor:"transparent"}}>
                            <tr className='header-add-box' >
                                <th colSpan={2} style={{ width: "300px"}}>
                                    <Select  onChange={handleChange} options={options} />
                                </th>
                                <th colSpan={1} style={{ width: "100px", paddingBottom: "15px" }}>
                                    <input style={{ width: "100px", fontSize: "18px", backgroundColor: "white", border: "1px soild white", color: "black",textAlign:"left",outlineColor:"lightgray",borderColor:"gray" }} 
                                            type="number" 
                                            name="test_name" 
                                            min="1" 
                                            placeholder=" Quantity"
                                            ref={quantityRef} />
                                </th>
                                <th colSpan={1} style={{ width: "30px", paddingBottom: "15px" }}>
                                    <button className='add-product-btn' onClick={()=>handleAdd()}>
                                        <i className="fa-sharp fa-solid fa-cart-plus" style={{ fontSize: "20px"}}></i>
                                    </button>
                                </th>
                                <th colSpan={1} style={{ width: "10px" }}></th>
                            </tr>
                        </thead>
                        <tbody className='body-table-add-box'>
                            {
                                books.map(book => {
                                    return <ProductInfor handleDelete={HandleDelete} product={book} key={book.productId.toString()} />;
                                })
                            }
                        </tbody>
                    </table>
                </div>
                <div className=' ml-2 add-customer-box align-items-center d-flex justify-content-center flex-column'>
                    <AddCustomToOrder/>       
                </div>
            </div>
            <div className='row'>
                <table className="table">
                    <thead style={{display: "block"}}>
                        <tr style={{backgroundColor:"#3f897d42"}}>
                            <th scope="col" style={{ width: "500px" }}>Tên sách</th>
                            <th scope="col" style={{ width: widthColumn_detail }}>Giá</th>
                            <th scope="col" style={{ width: widthColumn_detail }}>Số Lượng</th>
                            <th scope="col" style={{ width: widthColumn_detail }}>Thành tiền</th>
                        </tr>
                    </thead>
                    <tbody className='body-table-detail-box'>
                        {
                            books.map(book => {
                                return <ProductDetail product={book} key={book.productId.toString()} />;
                            })
                        }
                    </tbody>
                </table>
            </div>
        </div>
    )
}
const ProductInfor = (props: { product: IOrderDetailProduct, handleDelete: Function }) => {
    return (
        <tr>
            <td colSpan={2} style={{ width: "240px",textAlign:"left" }}>Title: {props.product.title}</td>
            <td colSpan={1} style={{ width: "135px" }}>{props.product.quantity.toString()}</td>
            <td colSpan={1} style={{ width: "30px" }}>
                <span onClick={() => {
                    props.handleDelete(props.product.productId)
                }}>
                    <button className='add-product-btn' >
                        <i className="fa-solid fa-trash"></i>
                    </button>
                </span>
            </td>
        </tr>
    )
}
const ProductDetail = (props: { product: IOrderDetailProduct}) => {
    return (
        <tr>
            <th scope="row" style={{ width: "500px" }}>{props.product.title} </th>
            <td style={{ width: widthColumn_detail }}>
                <NumericFormat
                        displayType="text"
                        value={props.product.uniPrice?.toString()}
                        thousandSeparator={true}
                        suffix="đ"
                />
            </td>
            <td style={{ width: widthColumn_detail }}>{props.product.quantity}</td>
            <td style={{ width: widthColumn_detail }}>
                <NumericFormat
                            displayType="text"
                            value={(props.product.uniPrice*props.product.quantity)}
                            thousandSeparator={true}
                            suffix="đ"
                    />
            </td>
        </tr>
    )
}
const widthColumn_detail = "120px"