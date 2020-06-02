import React from "react";

export const CreateTweet = props => {
    const userCanTweet = props.permission === 'false' ? false : true;
    const {errorMessage} = props

    let errorRender = errorMessage ? (
        <div className="alert alert-danger mx-auto col-md-8">
            All fields must be filled
        </div>
        ) : <div className="d-none alert alert-danger mx-auto col-md-8">
                    All fields must be filled
         </div>

    let renderElement = null;
    if(userCanTweet){
        renderElement = (
            <React.Fragment>
                {errorRender}
                <form className="form col-10 col-md-8 mt-3 mx-auto"
                      onSubmit={props.submitHandler}>
                    <div className="alert alert-danger d-none"></div>
                    <textarea className="form-control" placeholder="Create tweet"
                              ref={props.reference}></textarea>
                    <button type="submit" className="btn btn-primary my-3">Save</button>
                </form>
            </React.Fragment>
        )
    }

    return renderElement
}