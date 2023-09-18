import {lazy, Suspense} from 'react';
import { dynamicIconImports, LucideProps } from 'lucide-react';


const fallback = <div className="h-4 w-4 bg-[#020817] rounded-sm opacity-20" />;

interface IconProps extends Omit<LucideProps, 'ref'> {
    name: keyof typeof dynamicIconImports;
}

const Icon = ({name, ...props}: IconProps) => {
    const LucideIcon = lazy(dynamicIconImports[name]);
    return (
        <Suspense fallback={fallback}>
            <LucideIcon {...props} />
        </Suspense>
    )
}

export default Icon
