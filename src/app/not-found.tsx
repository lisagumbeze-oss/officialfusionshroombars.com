import { redirect } from 'next/navigation';

export default function NotFound() {
    // This component will be rendered whenever a route is not found.
    // We use the redirect function from next/navigation to send users
    // back to the home page automatically.
    redirect('/');
}
