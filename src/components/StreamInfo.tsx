export const StreamInfo = ({ stream }: { stream: any }) => (
  <section className="mt-6 border-b border-gray-800 pb-4">
    <h2 className="text-3xl font-bold text-white">{stream.title}</h2>

    <div className="flex items-center mt-4">
      <img
        src="https://placehold.co/40x40/00FFA3/FFFFFF?text=H"
        className="w-10 h-10 rounded-full border-2 border-[#00FFA3]"
      />
      <div className="ml-3">
        <p className="text-lg font-bold">stream.channelName</p>
        <p className="text-sm text-gray-400">구독자 765명</p>
      </div>
    </div>
  </section>
);
