import {
	FiFileText,
	FiUsers,
	FiShield,
	FiSettings,
	FiBox,
	FiColumns,
} from "react-icons/fi";
import SideNav from "./SideNav";

const SA_SideNav = () => {
	return (
		<div>
			<SideNav
				title="Super Admin"
				sections={[
					{
						id: "logs",
						label: "Logs",
						icon: <FiFileText className="h-4 w-4" />,
						items: [
							{
								label: "Super Admin Logs",
								href: "/super-admin/logs/super-admin",
							},
							{
								label: "Command Admin Logs",
								href: "/super-admin/logs/command-admin",
							},
							{
								label: "Finance Admin Logs",
								href: "/super-admin/logs/finance-admin",
							},
							{
								label: "Data Entry Logs",
								href: "/super-admin/logs/data-entry",
							},
						],
					},
					{
						id: "admins",
						label: "Admins",
						icon: <FiShield className="h-4 w-4" />,
						items: [
							{
								label: "Command Admins",
								href: "/super-admin/admins/command-admin",
							},
							{
								label: "Finance Admins",
								href: "/super-admin/admins/finance-admin",
							},
							{
								label: "Data Entry Admins",
								href: "/super-admin/admins/data-entry",
							},
						],
					},
					{
						id: "users",
						label: "Users",
						icon: <FiUsers className="h-4 w-4" />,
						href: "/super-admin/user-list",
					},
					{
						id: "marketing-teams",
						label: "Marketing Teams",
						icon: <FiBox className="h-4 w-4" />,
						href: "/super-admin/marketing-teams",
					},
					{
						id: "land-allocation",
						label: "Land Allocation",
						icon: <FiColumns className="h-4 w-4" />,
						href: "/super-admin/land-allocation",
					},
					{
						id: "settings",
						label: "Settings",
						icon: <FiSettings className="h-4 w-4" />,
						items: [
							{
								label: "Profile Settings",
								href: "/super-admin/settings/profile",
							},
						],
					},
				]}
				initialOpenId="logs"
			/>
		</div>
	);
};

export default SA_SideNav;
