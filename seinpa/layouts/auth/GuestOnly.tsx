import { useEffect } from 'react';
import { useRouter } from 'expo-router';
import { useSession } from '../../hooks/useSession';
import ThemedLoader from '../ThemedLoader';


const GuestOnly = ({ children }) => {
    const { session, isLoggedIn } = useSession();
    const router = useRouter();
    useEffect(() => {
        if (isLoggedIn === true && session?.user !== null) {
            router.replace('/profile'); // Redirect to profile if authenticated
        }
    }, [isLoggedIn, session?.user]);

    if (!isLoggedIn || !session?.user) {
        return (
            <ThemedLoader />
        ); // or a loading spinner
    }

    return <>{children}</>; // Render children if authenticated
} 

export default GuestOnly;