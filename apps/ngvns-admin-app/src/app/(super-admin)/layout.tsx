import React from "react";
import SuperadminNav from "../../components/common/navs/SuperadminNav";
import SA_SideNav from "../../components/common/sidenavs/SA_SideNav";

function layout({ children }: { children: React.ReactNode }) {
	return (
		<div>
			<SuperadminNav />
			<div className=" flex gap-x-2">
				<div>
					<SA_SideNav />
				</div>
				<div className="flex-1">{children}</div>
			</div>
		</div>
	);
}

export default layout;
