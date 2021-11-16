import React, { useState, useEffect } from 'react'
import { Formik, Field, Form, FieldArray } from 'formik'
import CardEmployee from '../Cards/CardEmployee';
import axios from 'axios';
import {
    useParams,
    useLocation
} from "react-router-dom";
import ManagerModal from '../Modals/ManagerModal';
import { isNull } from 'lodash';
import { IoTrashBin } from "react-icons/io5";
import NumberFormat from "react-number-format";

import * as Yup from 'yup';

const ExitClearance = Yup.object().shape({
    dept: Yup.string()
        .required('Required').nullable(),
    outstandingExist: Yup.string()
        .required('Required').nullable(),
    // accept: Yup.bool().oneOf([true], 'Accept Terms & Conditions is required'),
});

const DocExitForm = ({
    id,
    data,
    setSubmitted,
    setOpenModal,
    checkpoint,
    inputToken
}) => {

    const [token, setToken] = useState(false);
    const [errorToken, setErrorToken] = useState(false);
    // const [isOpen, setIsOpen] = useState(false);
    // const [submitted, setSubmitted] = useState(false);
    useEffect(async () => {
        if (deptList.find(isSelectedToken)) {
            setToken(deptList.find(isSelectedToken))
            readForm(deptList.find(isSelectedToken).value)
        }
    }, [])

    const readForm = async (dept) => {
        const formData = new FormData();
        formData.append('offboardingID', id);
        formData.append('dept', dept);
        const res = await axios.post('/api/readinput', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        }).then(response => {
            return response
        }).catch(error => {
            return error.response
        });
    }

    const DeptInput = ({ dept, index, values, setFieldValue }) => {
        const deptSelected = deptList.findIndex((element) => element.value == dept);
        const [value, setValue] = useState(null);
        const onChangeValue = (inputName, value) => {
            console.log(inputName)
            setFieldValue(inputName, value)
        }
        return (
            <>
                {
                    deptList[deptSelected].children?.map((item, i) => (
                        <div key={i} className="flex-grow">
                            <label htmlFor={`items.${index}.${item}`}>{item}</label>
                            {item == 'Outstanding' || item == 'Hak' || item == 'Kewajiban' || item == 'Amount' || item == 'Ekses Medical' ?
                                <MyNumberInput
                                    key={i}
                                    value={value}
                                    setValue={setValue}
                                    // onChangeValue={onChangeValue}
                                    inputName={`items.${index}.${item}`}
                                    setFieldValue={setFieldValue}
                                />
                                :
                                <Field name={`items.${index}.${item}`} />
                            }
                        </div>
                    ))
                }
            </>
        )
    }

    const MyNumberInput = ({ value, setValue, onChangeValue, inputName, setFieldValue, key }) => {
        // const [value, setValue] = useState(null);
        // console.log(value);
        return (
            <>
                <NumberFormat
                    // placeholder="Number Format Input looses focus"
                    isNumericString={false}
                    // thousandSeparator={true}
                    value={value}
                    onValueChange={vals => {
                        setFieldValue(inputName, vals.formattedValue)
                        // onChangeValue(inputName,vals.formattedValue)
                        // setValue(vals.formattedValue)
                    }}
                    // onValueChange={vals => value = vals.formattedValue}
                    prefix={"Rp. "}
                    thousandSeparator="."
                    decimalSeparator=","
                // {...this.props}
                />
                {/* {value}
                {inputName} */}
            </>
        );
    }

    const deptList = [
        {
            name: 'Fastel',
            value: 'fastel',
            children: ['MSISDN', 'Outstanding'],
            cp: checkpoint?.confirm_fastel,
            inputToken: data?.input_token?.fastel,
        },
        {
            name: 'Finance',
            value: 'finance',
            children: ['Vendor', 'Amount', 'Text'],
            cp: checkpoint?.confirm_finance,
            inputToken: data?.input_token?.finance,
        },
        {
            name: 'HR Dev',
            value: 'hrdev',
            children: ['Perihal', 'Tujuan', 'Tanggal Kegiatan', 'Penyelenggara', 'Periode Ikadin'],
            cp: checkpoint?.confirm_hrdev,
            inputToken: data?.input_token?.hrdev,
        },
        {
            name: 'Kopindosat',
            value: 'kopindosat',
            children: ['Hak', 'Kewajiban'],
            cp: checkpoint?.confirm_kopindosat,
            inputToken: data?.input_token?.kopindosat,
        },
        {
            name: 'IT',
            value: 'it',
            children: ['Code', 'Item', 'Qty'],
            cp: checkpoint?.confirm_it,
            inputToken: data?.input_token?.it,
        },
        {
            name: 'Medical',
            value: 'medical',
            children: ['Ekses Medical'],
            cp: checkpoint?.confirm_medical,
            inputToken: data?.input_token?.medical,
        },
    ]
    function isSelectedToken(deptList) {
        return deptList.inputToken === inputToken;
    }


    return (
        <>
            <h2 className="text-2xl font-bold">Document Exit Form - New Version</h2>
            <p className="text-justify">Cek outstanding per divisi</p>
            <hr className="mb-3" />
            {!token &&
                <>
                    <Formik
                        initialValues={{
                            token: '',
                        }}
                        onSubmit={async (values) => {
                            function isTokenSame(deptList) {
                                return deptList.inputToken === values.token;
                            }
                            if (deptList.find(isTokenSame)) {
                                setToken(deptList.find(isTokenSame))
                                readForm(deptList.find(isTokenSame).value)
                            } else {
                                setErrorToken({ message: 'Token Not Correct' })
                            }
                        }}
                    >
                        <Form>
                            <label htmlFor="token">Input Token</label>
                            <Field id="token" type="password" name="token" placeholder="Token" />
                            {errorToken && (
                                <div className="text-red-600 text-sm -mt-4">{errorToken.message}</div>
                            )}
                            <button type="submit" className="bg-primary text-white p-3 text-lg uppercase">Unlock</button>
                        </Form>
                    </Formik>
                </>
            }
            {token &&

                <>
                    {
                        token.cp != 1 &&
                        <Formik
                            initialValues={{
                                accept: false,
                                // dept: '',
                                dept: token?.value,
                                outstandingExist: '',
                                //General (Fastel,Medical)
                                outstanding: '',
                                //Fastel
                                msisdn: '',
                                //Kopindosat
                                member: false,
                                hak: '',
                                kewajiban: '',
                                //Ikatan Dinas, Finance, IT
                                items: [{}],

                            }}
                            validationSchema={ExitClearance}
                            onSubmit={async (values) => {
                                setOpenModal(true);
                                const formData = new FormData();
                                formData.append('offboardingID', id);
                                formData.append('dept', values.dept);
                                formData.append('process_type', 3);
                                formData.append('outstanding_exist', values.outstandingExist);
                                formData.append('items', JSON.stringify(values.items));
                                // formData.append('qty', values.qty);
                                const res = await axios.post('/api/rightobligation', formData, {
                                    headers: {
                                        'Content-Type': 'multipart/form-data'
                                    }
                                }).then(response => {
                                    console.log(response)
                                    return response
                                }).catch(error => {
                                    return error.response
                                });
                                console.log(res.data);
                                if (res.status == '200') {
                                    setSubmitted(true)
                                } else {
                                    setSubmitted(false)
                                }
                            }}



                            render={({ values, errors, touched, setFieldValue }) => (
                                <Form>
                                    <h3 className="text-lg font-bold mb-2">Dept : {token?.name}</h3>
                                    {/* <label htmlFor="dept">Dept</label> */}
                                    {/* <Field as="select" name="dept"
                                onBlur={() => setFieldValue('items', [{}])}
                            >
                                <option value="" disabled>Select Dept</option>
                                {deptList.map((item, i) => (
                                    <option value={item.value}
                                        disabled={item.cp == "1" || inputToken != item.inputToken ? true : false}
                                        selected={inputToken == item.inputToken ? true : false}
                                    >{item.name}</option>
                                ))}
                            </Field> */}
                                    {/* {deptList.map((item, i) => (
                                item.inputToken == inputToken &&
                                <label htmlFor="dept" className="block">
                                    <Field value={item.value}
                                        type="radio"
                                        name="dept"
                                        disabled={item.cp == "1" || inputToken != item.inputToken ? true : false}
                                        checked={item.inputToken == inputToken ? true : false}
                                    // onCheck={() => setFieldValue('items', [{}])}
                                    />
                                    {item.name}
                                </label>
                            ))}
                            {errors.dept && touched.dept &&
                                <div className="-mt-4 mb-4 text-red-600 text-sm">{errors.dept}</div>
                            } */}

                                    <div className="mb-4  bg-gray-100 p-3 rounded">
                                        <label className="block">
                                            <Field type="radio" name="outstandingExist" value="1" className="my-0 mr-2" />
                                            Ada Outstanding
                                        </label>
                                        {values.outstandingExist == '1' && values.dept &&
                                            <FieldArray
                                                name="items"
                                                render={arrayHelpers => (
                                                    <div className="mt-4">
                                                        {values.dept == 'it' || values.dept == 'finance' ?
                                                            <button type="button" className="bg-blue-600 text-white" onClick={() => arrayHelpers.push("")}>
                                                                + Add Item
                                                            </button>
                                                            : null}
                                                        {values.items && values.items.length > 0 ? (
                                                            values.items.map((item, index) => (
                                                                <div key={index} className={values.dept == 'it' || values.dept == 'finance' ? "flex" : null}>
                                                                    {values.dept && <DeptInput dept={values.dept} index={index} values={values} setFieldValue={setFieldValue} />}
                                                                    {/* <div className="flex-grow">
                                                           <label htmlFor={`items.${index}.code`}>Code</label>
                                                           <Field name={`items.${index}.code`} />
                                                       </div>
                                                       <div className="flex-grow px-2">
                                                           <label htmlFor={`items.${index}.item`}>Item</label>
                                                           <Field name={`items.${index}.item`} />
                                                       </div>
                                                       <div className="flex-grow px-2">
                                                           <label htmlFor={`items.${index}.qty`}>Qty</label>
                                                           <Field name={`items.${index}.qty`} />
                                                       </div> */}
                                                                    {values.dept == 'it' || values.dept == 'finance' ?
                                                                        <button
                                                                            className="w-min bg-red-600 text-white rounded mt-8"
                                                                            type="button"
                                                                            onClick={() => arrayHelpers.remove(index)} // remove a friend from the list
                                                                        >
                                                                            <IoTrashBin />
                                                                        </button>
                                                                        : null
                                                                    }
                                                                </div>
                                                            ))
                                                        ) : (
                                                            null
                                                        )}
                                                    </div>
                                                )}
                                            />
                                        }
                                    </div>

                                    <label className="mb-4 block bg-gray-100 p-3 rounded">
                                        <Field type="radio" name="outstandingExist" value="0" className="my-0 mr-2" />
                                        Tidak Ada Outstanding
                                        {errors.accept && touched.accept ? (
                                            <div className="text-red-600 text-sm">{errors.accept}</div>
                                        ) : null}
                                    </label>
                                    {/* <label className="mb-4 block bg-gray-100 p-3 rounded">
                                <Field type="checkbox" name="accept" className="my-0 mr-2" />
                                Saya menyetujui data yang dikirimkan adalah benar
                                {errors.accept && touched.accept ? (
                                    <div className="text-red-600 text-sm">{errors.accept}</div>
                                ) : null}
                            </label> */}

                                    {/* <label className="mb-4">
                                <Field type="checkbox" name="accept" className="my-0 mr-2" />
                                Accept, declare it's true
                            </label> */}

                                    <button type="submit" className="bg-primary text-white p-3 text-lg uppercase">Submit</button>
                                </Form>
                            )}
                        />
                    }
                    {
                        token.cp == 1 &&
                        <>
                            <h3 className="text-lg font-bold mb-2">Dept : {token?.name}</h3>
                            <div className="mb-4 block bg-green-300 p-3 rounded font-bold text-center text-green-700">
                                <i className="fas fa-check"></i> CONFIRMED
                            </div>
                        </>
                    }
                </>

            }

        </>

    )
}


export default DocExitForm
