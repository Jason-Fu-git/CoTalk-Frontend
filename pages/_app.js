import "tailwindcss/tailwind.css";
import TopBar from '../components/TopBar';
import {ThemeProvider} from 'next-themes';

function MyApp({Component, pageProps}) {
    return (
        <ThemeProvider attribute="class">
            <div className=" w-full min-h-screen">
                <TopBar />
                <Component {...pageProps} />
            </div>
        </ThemeProvider>
    );
}

export default MyApp;