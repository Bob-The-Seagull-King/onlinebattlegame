import React from 'react';

// Package Imports
import 'bootstrap/dist/css/bootstrap.css';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';

// Style Components
import '../../../resources/styles/App.css';
import '../../../resources/styles/CustomStyleHost.scss'

const TextInput = (props: any) => {
    // Initialize Props
    const InputName : string = props.inputname;
    const UpdateMethod : any = props.updatemethod;
    let TextValue : string = props.textvalue;

    return (
        <>
            <InputGroup className="mb-3">
                <InputGroup.Text id="basic-addon1" className="inputtitletext inputhead">{InputName}</InputGroup.Text>
                <Form.Control
                placeholder={InputName}
                aria-label={InputName}
                defaultValue={TextValue}
                onChange={(event) => UpdateMethod(event.target.value)}
                aria-describedby="basic-addon1"
                className="inputbody"
                />
            </InputGroup>
        </>
    )
}

export default TextInput