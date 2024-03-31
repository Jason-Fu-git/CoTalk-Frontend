export async function getServerSideProps({params}) {
    const {userid}=params;
    return {
        props: {
            userid
        }
    }
}

function Greet(props) {
    return (
        <div>Hello, user#{props.userid}</div>
    )
}

export default Greet;