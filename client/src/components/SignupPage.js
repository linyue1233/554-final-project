import React from 'react';


//username, email, password, avatar
function SignupPage(){
    let username;
    let password;
    let email;
    let avatar;
    let body;

    const handleCreateUser = ()=>{
        
    }

    body = (
        <form className='form' id='create_user' onSubmit={handleCreateUser}>
            <div className='form-group'>
                <label>
                username:
                    <br/>
                    <input
                        ref={(node)=>{
                            username = node;
                        }}
                    required
                    autoFocus={true}
                    />
                </label>
            </div>
            <br/>
            <div className='form-group'>
                <label>
                password:
                    <br/>
                    <input type="password"
                        ref={(node)=>{
                            password = node;
                        }}
                    required
                    
                    />
                </label>
            </div>
            <br/>
            <div className='form-group'>
                <label>
                email:
                    <br/>
                    <input
                        ref={(node)=>{
                            email = node;
                        }}
                    required
                    
                    />
                </label>
            </div>
            <br/>
            <div className='form-group'>
                <label>
                avatar:
                    <br/>
                    <input
                        ref={(node)=>{
                            avatar = node;
                        }}
                    required
                    
                    />
                </label>
            </div>
            <br/>
            <br/>
            <br/>
            <button className='button' type='submit'>
                Comfirm
            </button>
        </form>
    );

    return(
        <div>
            {body}
        </div>
    );
}

export default  SignupPage;