import PropertyForm from '@/components/admin/PropertyForm';
import Link from 'next/link';

export default function ManagerNewPropertyPage() {
    return (
        <div className="min-h-screen bg-[#fafafa] pb-24">
            {/* Top Logo Header */}
            <div className="bg-white px-4 py-3 flex justify-between items-center shadow-sm z-10 relative">
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 relative">
                        <img src="/logo.png" alt="Realprop Realty" className="w-full h-full object-contain" />
                    </div>
                    <div className="flex flex-col">
                        <span className="font-extrabold text-gray-900 leading-none tracking-tight text-[15px]">Realprop Realty</span>
                        <span className="text-[9px] font-bold text-primary-600 uppercase tracking-widest mt-0.5">Manager Console</span>
                    </div>
                </div>
                <Link href="/manager" className="p-2 text-gray-600">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </Link>
            </div>

            <div className="container mx-auto px-4 py-8 max-w-4xl">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        Add New Property
                    </h1>
                    <p className="text-gray-600">
                        Create a new property listing for the marketplace.
                    </p>
                </div>

                <PropertyForm mode="create" />
            </div>
        </div>
    );
}
