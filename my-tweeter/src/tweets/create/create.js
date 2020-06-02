import React from "react";

export const CreateTweet = props => {
    const userCanTweet = props.permission === 'false' ? false : true;

    let renderElement = null;
    if(userCanTweet){
        renderElement = (<form className="form col-10 col-md-8 mt-3 mx-auto"
                  onSubmit={props.submitHandler}>
                <div className="alert alert-danger d-none"></div>
                <textarea className="form-control" placeholder="Create tweet"
                          ref={props.reference}></textarea>
                <button type="submit" className="btn btn-primary my-3">Save</button>
            </form>)
    }

    return renderElement
}