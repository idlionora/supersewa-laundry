function NotFound() {
    return (
		<main className="w-full min-h-screen bg-[#e5e7eb] flex flex-col items-center pt-[4rem] relative min-[575px]:px-[1.125rem]">
			<div className="w-full max-w-[33rem] bg-white min-[528px]:rounded-lg border-b-[1px] min-[528px]:border-x-[1px] border-[#999] border-t-4 border-t-[#B00100] drop-shadow-lg overflow-hidden flex flex-col items-center text-center">
				<h1 className="px-4 w-full max-w-[26rem] text-[#730e15] font-bold text-base mt-[1.125rem]">
					The page you were looking for doesn't exist.
				</h1>
				<p className="px-4 w-full max-w-[26rem] text-[#2e2f30] text-base my-4">
					You may have mistyped the address or the page may have moved
				</p>
				<div className="w-full border-t-[#BBB] p-4 border-t-2 bg-[#F7F7F7] text-[#666666] text-base">
					<p>
						If you are the application owner, check the logs for more&nbsp;information
					</p>
				</div>
			</div>
		</main>
	);
}

export default NotFound
