'use client';

// react
import { useEffect, useLayoutEffect, useState } from 'react';

// next
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

// hooks
import { useAppDispatch, useAppSelector } from '@/hooks/useRedux';

// react-icon
import { LuLogOut } from 'react-icons/lu';
import { AiOutlineSetting } from 'react-icons/ai';
import { CgProfile } from 'react-icons/cg';

// daisyui
import { Navbar, Dropdown, Avatar, Menu } from 'react-daisyui';

// action
import { userActions } from '@/store/user';

const { requestUpdateMe, requestLoggedOut } = userActions;

export default function NavbarMenu(props: { token: string }) {
  // router
  const router = useRouter();

  // store
  const dispatch = useAppDispatch();
  const { me } = useAppSelector((state) => state.user);

  // useEffect
  useLayoutEffect(() => {
    dispatch(requestUpdateMe(props.token));
  }, []);

  // handle
  const handleLogout = () => {
    dispatch(requestLoggedOut());
    router.push('/logout');
  };

  return (
    <>
      <div className="sticky top-0 z-30 flex h-20 w-full justify-center bg-opacity-90 backdrop-blur transition-all duration-100 bg-base-100 text-base-content shadow-sm">
        <Navbar className="">
          <Navbar.Start className="flex-none">
            <div className="px-2 mx-2 text-2xl font-bold">
              <Link
                className="btn btn-ghost normal-case px-2 mx-2 text-2xl font-bold"
                href="/"
              >
                <Image
                  alt="logo"
                  src="/logo.png"
                  width={150}
                  height={50}
                  priority
                />
              </Link>
            </div>
            <Menu horizontal className="px-1 text-lg">
              <Menu.Item>
                <a>채널 편성표</a>
              </Menu.Item>
            </Menu>
          </Navbar.Start>
          <Navbar.Center className="flex justify-end items-center"></Navbar.Center>
          <Navbar.End className="lg:w-full">
            <div className="mr-7">
              {me && (
                <p>
                  <strong className="text-xl">{me.name}</strong> (
                  <span>@{me.userId}</span>)
                </p>
              )}
            </div>
            <Dropdown className="mr-10" hover end>
              <Avatar
                src={
                  me ? `/api/user/${me.id}/avatar` : '/default_user_avatar.webp'
                }
                size="sm"
                shape="circle"
                border
              />
              <Dropdown.Menu className="w-48 bg-base-100 shadow-xl ">
                <li>
                  <Link href="/settings/profile">
                    <CgProfile />
                    프로필
                  </Link>
                </li>

                <li>
                  <Link href="/settings/users">
                    <AiOutlineSetting />
                    설정
                  </Link>
                </li>

                <hr />
                <Dropdown.Item onClick={handleLogout}>
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
