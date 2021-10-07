import {FaUserAlt} from "react-icons/fa";

const UserImage = ({photo}) => {

    return (
        <>
            {photo !== null ? <img 
                          className='user-photo' 
                          src={`${photo}`} 
                          width='37' 
                          height='37' 
                          alt='img' 
                            />: <FaUserAlt className='alt-user-photo' />}
        </>
    )
}

export default UserImage; 