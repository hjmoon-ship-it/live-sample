export const StreamMeta = ({ stream }: { stream: any }) => (
  <section className="mt-4 p-4 bg-gray-800 rounded-lg">
    <div className="flex flex-col lg:flex-row space-y-2 lg:space-y-0 lg:space-x-6 text-sm text-gray-400">
      <div>
        <span className="font-semibold text-white mr-2">방송 시작:</span>
        {new Date(stream.created_at).toLocaleString("ko-KR")}
      </div>
    </div>
  </section>
);
