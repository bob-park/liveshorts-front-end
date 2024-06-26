"use client";

// react
import { useLayoutEffect } from "react";

import cx from "classnames";

// next
import { useRouter, useSelectedLayoutSegments } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

// react-icon
import { LuLogOut } from "react-icons/lu";
import { AiOutlineSetting } from "react-icons/ai";
import { CgProfile } from "react-icons/cg";

// daisyui
import { Navbar, Dropdown, Avatar, Menu } from "react-daisyui";

import routes from "../routes";
import { getRoleType } from "@/utils/parseUtils";

import useSessionTouch from "@/hooks/user/useSessionTouch";
import useGetUserDetail from "@/hooks/user/useGetUserDetail";
import useLogout from "@/hooks/user/useLogout";

const activeMenuItem = (segments: string[], menuPaths: string[]) => {
  if (menuPaths.every((menuPath) => segments.some((segment) => segment === menuPath))) {
    return "active";
  }

  return "";
};

export default function NavbarMenu() {
  // router
  const router = useRouter();
  const segments = useSelectedLayoutSegments();

  const { me } = useSessionTouch();
  const { onGetUserDetail } = useGetUserDetail();
  const { onLogout } = useLogout(() => router.push("/login"));

  // useEffect
  useLayoutEffect(() => {
    if (me) {
      !me.department && onGetUserDetail(me.id);
    }
  }, [me?.id]);

  return (
    <>
      <div className="sticky top-0 z-50 flex h-20 w-full justify-center bg-opacity-90 backdrop-blur transition-all duration-100 bg-base-100 text-base-content shadow-sm">
        <Navbar className="">
          <Navbar.Start className="flex-none">
            <div className="px-2 mx-2 text-2xl font-bold">
              <Link className="btn btn-ghost normal-case px-2 mx-2 text-2xl font-bold" href="/">
                <Image alt="logo" src="/logo.png" width={150} height={50} priority />
              </Link>
            </div>
            <Menu horizontal className="px-1 text-lg">
              {routes.map((route) => (
                <Menu.Item key={`route-menu-item-${route.id}`}>
                  <Link className={cx(activeMenuItem(segments, ["broadcast", "schedule"]))} href={route.route}>
                    {route.name}
                  </Link>
                </Menu.Item>
              ))}
            </Menu>
          </Navbar.Start>
          <Navbar.Center className="flex justify-end items-center"></Navbar.Center>
          <Navbar.End className="lg:w-full">
            <div className="mr-7">
              {me && (
                <p className="align-middle">
                  <strong className="text-xl">{me.name}</strong> (<span>@{me.userId}</span>)
                </p>
              )}
            </div>
            <Dropdown className="mr-10" end>
              <div className="" tabIndex={0}>
                <Avatar
                  src={me ? `/api/user/${me.id}/avatar` : "/default_user_avatar.webp"}
                  size="sm"
                  shape="circle"
                  border
                />
              </div>

              <Dropdown.Menu className="bg-base-100 shadow-xl w-[250px]" tabIndex={0}>
                <li className="disabled ">
                  <div className="flex gap-3 py-2 items-start">
                    <div className="flex-none pt-3">
                      <Avatar
                        src={me ? `/api/user/${me.id}/avatar` : "/default_user_avatar.webp"}
                        size="xs"
                        shape="circle"
                        border
                      />
                    </div>
                    <div className="flex-1 ml-2">
                      <div className="flex flex-col gap-1 text-black text-base ">
                        <div>
                          <p>
                            <span className="font-bold tex-sm text-gray-500">{me?.department}</span>
                          </p>
                          <p>
                            <span className="font-bold text-lg">{me?.name}</span>
                          </p>
                          <p>
                            <span className="tex-sm text-gray-500">@{me?.userId}</span>
                          </p>
                        </div>

                        <h3 className="py-2">{me && <strong>{getRoleType(me.role).name}</strong>}</h3>
                      </div>
                    </div>
                  </div>
                </li>

                <hr />

                <li>
                  <a href="#">
                    <CgProfile />
                    프로필
                  </a>
                </li>

                <li>
                  <a href="#">
                    <AiOutlineSetting />
                    설정
                  </a>
                </li>

                <hr />
                <Dropdown.Item onClick={() => onLogout()}>
                  <LuLogOut />
                  로그아웃
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </Navbar.End>
        </Navbar>
      </div>
    </>
  );
}
