import { Link } from "react-router-dom";

const NotFoundPage = () => {
    return (
        <main>
            <h1>404 - Page Not Found</h1>
            <p>The page you're looking for doesn't exist.</p>

            <Link to="/">
                Return to Home
            </Link>
        </main>
    );
};

export default NotFoundPage;

