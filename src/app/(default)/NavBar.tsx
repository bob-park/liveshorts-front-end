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
import { LuLayoutDashboard, LuLogOut } from 'react-icons/lu';
import {
  GrDocumentTime,
  GrDocumentUpdate,
  GrNotification,
} from 'react-icons/gr';
import { MdOutlineHolidayVillage } from 'react-icons/md';
import {
  AiOutlineUnorderedList,
  AiOutlineSetting,
  AiFillNotification,
} from 'react-icons/ai';
import { CgProfile } from 'react-icons/cg';
import { BsInfoCircle } from 'react-icons/bs';
import { VscError } from 'react-icons/vsc';
import { IoNotificationsOutline } from 'react-icons/io5';

// daisyui
import {
  Navbar,
  Dropdown,
  Button,
  Badge,
  Menu,
  Avatar,
  Drawer,
  Tooltip,
  Toast,
} from 'react-daisyui';

// action
import { userActions } from '@/store/user';

const { requestUpdateMe } = userActions;

export default function NavBar(props: { token: string }) {
  // router
  const router = useRouter();

  // store
  const dispatch = useAppDispatch();
  const { me } = useAppSelector((state) => state.user);

  // useEffect
  useLayoutEffect(() => {
    if (!me) {
      dispatch(requestUpdateMe(props.token));
    }
  }, [me]);

  // handle
  const handleLogout = () => {
    router.push('/api/user/logout');
  };

  return (
    <>
      <div className="sticky top-0 z-30 flex h-20 w-full justify-center bg-opacity-90 backdrop-blur transition-all duration-100 bg-base-100 text-base-content shadow-sm">
        <Navbar className="">
          <Navbar.Start className="flex-none">
            <div className="flex-1 px-2 mx-2 text-2xl font-bold">
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
          </Navbar.Start>
          <Navbar.End className="lg:w-full">
            <div className="mr-7">
              {me && (
                <p>
                  <strong>{me.name}</strong> (<span>{me.userId}</span>)
                </p>
              )}
            </div>
            <Dropdown className="mr-10" hover end>
              <Avatar
                src={me && `/api/user/${me.id}/avatar`}
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
