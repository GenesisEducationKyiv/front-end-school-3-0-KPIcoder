// Import styles, initialize component theme here.
// import '../src/common.css';
import { beforeMount } from '@playwright/experimental-ct-react/hooks';
import Providers from "@/providers";


beforeMount(async ({ App }) => {
    return <Providers><App /></Providers>
});
