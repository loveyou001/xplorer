import SidebarMenu from './configs/sidebarMenu.config';
import SidebarDriveMenu from './configs/sidebarDriveMenu.config';
import BodyMenu from './configs/bodyMenu.config';
import MultipleSelectedMenu from './configs/multipleSelectedMenu.config';
import contextMenuItem from '../../Typings/contextMenuItem';
import fileThumbnail from '../Thumbnail/thumbnail';
import { getSelected } from '../Files/File Operation/select';
import FileMenu from './configs/fileMenu.config';

let contextMenu = document.querySelector('.contextmenu') as HTMLElement;
let contextMenuSubmenus = document.getElementById('contextmenu-submenus');

interface menuRoles {
	[key: string]: any; //eslint-disable-line
}
const menuRoles: menuRoles = {};

document.addEventListener('DOMContentLoaded', () => {
	contextMenu = document.querySelector('.contextmenu') as HTMLElement;
	contextMenuSubmenus = document.getElementById('contextmenu-submenus');
});

const ExtendedMenu: contextMenuItem[][] = [];
const addExtendedMenu = (menu: contextMenuItem[]) => {
	ExtendedMenu.push(menu);
};

const VisibilityHelper = (code: string, target: HTMLElement) => {
	switch (code) {
		case 'onTopOfFile':
			return target.dataset.isdir === undefined
				? false
				: target.dataset.isdir !== 'true' && !target.classList.contains('favorite-item') && !target.classList.contains('drive-item');
		case 'onTopOfDir':
			return target.dataset.isdir === undefined
				? false
				: target.dataset.isdir === 'true' && !target.classList.contains('favorite-item') && !target.classList.contains('drive-item');
		case 'onMultipleSelected':
			return getSelected().length > 1;
		case 'onTopOfWorkspace':
			return target.classList.contains('workspace-tab') || target.classList.contains('workspace');
		case 'onTopOfSidebarMenu':
			return target.classList.contains('favorite-item');
		case 'onTopOfSidebarDriveMenu':
			return target.classList.contains('drive-item');
	}
};

const MenuToElements = async (menu: contextMenuItem[][], target: HTMLElement): Promise<void> => {
	for (let index = 0; index < menu.length; index++) {
		const section = menu[index];
		let all_are_invisible_items = false;
		for (let i = 0; i < section.length; i++) {
			const item = section[i];
			const visible =
				item.visible === undefined
					? true
					: typeof item.visible === 'boolean'
					? item.visible
					: typeof item.visible === 'string'
					? VisibilityHelper(item.visible, target)
					: item.visible.some((code: string) => VisibilityHelper(code, target));
			if (visible) all_are_invisible_items = true;
			if (visible) {
				const menu = document.createElement('span');
				menu.classList.add('contextmenu-item');

				if (item.icon) {
					if (item.shortcut)
						menu.innerHTML = `<img src = "${await fileThumbnail(
							item.icon,
							'contextmenu',
							false
						)}">${item?.menu.trim()}<span class="contextmenu-item-shortcut">${item.shortcut}</span>`;
					else menu.innerHTML = `<img src = "${await fileThumbnail(item.icon, 'contextmenu', false)}" >${item?.menu?.trim()}`;
				} else {
					if (item.shortcut) menu.innerHTML = `${item?.menu?.trim()}<span class="contextmenu-item-shortcut">${item.shortcut}</span>`;
					else menu.innerHTML = item?.menu?.trim();
				}
				if (typeof item?.role === 'function' || typeof item?.role === 'string') {
					const roleIdentifier = Math.random().toString(36).substr(2, 10) + item?.menu?.replace(/\W/g, '')?.trim();
					menu.setAttribute('role', roleIdentifier);
					menuRoles[roleIdentifier] = item?.role;
				}
				contextMenu.appendChild(menu);

				const submenuId = Math.random().toString(36).substr(2, 10);

				// Create submenu element for context menu
				if (item.submenu) {
					const submenu = document.createElement('div');
					submenu.classList.add('contextmenu-submenu');

					menu.dataset.submenu = submenuId;
					submenu.id = submenuId;

					contextMenuSubmenus.appendChild(submenu);
					for (let j = 0; j < item.submenu.length; j++) {
						const submenuItem = item.submenu[j];
						const submenuItemElement = document.createElement('span');
						submenuItemElement.classList.add('contextmenu-item');

						if (submenuItem.icon) {
							if (submenuItem.shortcut)
								submenuItemElement.innerHTML = `<img src = "${await fileThumbnail(submenuItem.icon, 'contextmenu', false)}">${
									submenuItem.name ?? submenuItem
								}<span class="contextmenu-item-shortcut">${submenuItem.shortcut}</span>`;
							else
								submenuItemElement.innerHTML = `<img src = "${await fileThumbnail(
									submenuItem.icon,
									'contextmenu',
									false
								)}" >${submenuItem?.name?.trim()}`;
						} else {
							if (submenuItem.shortcut)
								submenuItemElement.innerHTML = `${submenuItem.name ?? submenuItem}<span class="contextmenu-item-shortcut">${
									submenuItem.shortcut
								}</span>`;
							else submenuItemElement.innerHTML = submenuItem.name;
						}

						if (typeof submenuItem?.role === 'function') {
							const roleIdentifier = Math.random().toString(36).substr(2, 10) + submenuItem?.name?.replace(/\W/g, '')?.trim();
							submenuItemElement.setAttribute('role', roleIdentifier);
							menuRoles[roleIdentifier] = submenuItem?.role;
						}

						submenu.appendChild(submenuItemElement);
					}
				}
			}
		}
		if (index !== menu.length - 1 && all_are_invisible_items) contextMenu.innerHTML += `<hr />`;
	}
	return;
};

/**
 * Context menu initializer
 * @returns {void}
 */
const ContextMenu = (): void => {
	document.addEventListener('contextmenu', async (e) => {
		e.preventDefault();
		document.querySelectorAll('.hover-preview').forEach((element) => {
			element.parentNode.removeChild(element);
		});
		contextMenu.innerHTML = '';
		contextMenu.style.height = 'initial';
		contextMenu.style.overflowY = 'initial';
		contextMenuSubmenus.innerHTML = '';
		let coorX = e.pageX;
		let coorY = e.pageY;

		let target = e.target as HTMLElement;
		while (target.dataset && !target.dataset.path) {
			target = target.parentNode as HTMLElement;
		}
		if (!target?.dataset?.path) return;

		const filePath = decodeURI(target.dataset.path);

		// Create the context menu
		if (getSelected().length > 1) {
			await MenuToElements(await MultipleSelectedMenu(target, filePath), target);
		} else if (target.classList.contains('favorite-item')) {
			await MenuToElements(await SidebarMenu(target, filePath), target);
		} else if (target.classList.contains('drive-item')) {
			await MenuToElements(await SidebarDriveMenu(target, filePath), target);
		} else if (target.classList.contains('workspace-tab')) {
			await MenuToElements(await BodyMenu(target, filePath), target);
		} else {
			await MenuToElements(await FileMenu(target, filePath), target);
		}

		if (coorY + contextMenu.offsetHeight > window.innerHeight && coorY - contextMenu.offsetHeight > -50) {
			coorY -= contextMenu.offsetHeight;
		}
		if (coorX + contextMenu.offsetWidth > window.innerWidth) coorX = window.innerWidth - contextMenu.offsetWidth;
		if (contextMenu.offsetHeight + coorY > window.innerHeight) {
			contextMenu.style.height = `${
				window.innerHeight - coorY - parseInt(window.getComputedStyle(contextMenu).getPropertyValue('padding-top')) * 2
			}px`;
			contextMenu.style.overflowY = 'auto';
		}

		contextMenu.style.left = coorX + 'px';
		contextMenu.style.top = coorY + 'px';
		contextMenu.scrollTop = 0;

		document.addEventListener('click', exitContextMenu);
	});
	const exitContextMenu = () => {
		contextMenu.style.left = '-100vw';
		contextMenu.style.top = '-100vh';
		contextMenuSubmenus.innerHTML = '';
		document.removeEventListener('click', exitContextMenu);
	};

	// Submenu handler
	document.addEventListener('mousemove', (e) => {
		// Expand contextmenu
		if (
			(e.pageX >= contextMenu.offsetLeft + contextMenu.offsetWidth - 15 || e.pageX <= contextMenu.offsetLeft + 15) &&
			e.pageX < contextMenu.offsetLeft + contextMenu.offsetWidth + 100
		) {
			return;
		}

		if (!((e.target as HTMLElement).parentNode as HTMLElement).className.startsWith('contextmenu-submenu')) {
			document.querySelectorAll('.contextmenu-submenu').forEach((submenu) => ((submenu as HTMLElement).style.display = 'none'));
		}
		if (
			(e.target as HTMLElement).dataset.submenu ||
			((e.target as HTMLElement).parentNode as HTMLElement).className.startsWith('contextmenu-submenu')
		) {
			const submenuElement = document.getElementById((e.target as HTMLElement).dataset.submenu);
			if (!submenuElement) return;

			const menuCoordinate = (e.target as HTMLElement).getBoundingClientRect();

			submenuElement.style.display = 'block';
			submenuElement.style.height = 'initial';
			submenuElement.style.overflowY = 'initial';

			let submenuCoorX = contextMenu.offsetLeft + contextMenu.offsetWidth;
			if (submenuCoorX + submenuElement.offsetWidth * 0.5 >= window.innerWidth) {
				submenuCoorX = contextMenu.offsetLeft - submenuElement.offsetWidth;
			}
			if (submenuElement.offsetHeight + menuCoordinate.top > window.innerHeight) {
				submenuElement.style.height = `${
					window.innerHeight -
					submenuElement.offsetHeight -
					parseInt(window.getComputedStyle(submenuElement).getPropertyValue('padding-top')) * 2
				}px`;
				submenuElement.style.overflowY = 'auto';
			}
			submenuElement.style.left = submenuCoorX + 'px';
			submenuElement.style.top = menuCoordinate.top + 'px';
			submenuElement.scrollTop = 0;
		}
	});

	contextMenu.addEventListener('click', (e) => {
		exitContextMenu();

		const menuClicked = e.target as HTMLElement;
		const menuRole = menuClicked?.getAttribute('role');
		if (!menuRole) return;

		if (typeof menuRoles[menuRole] === 'function') menuRoles[menuRole]();
		else {
			eval(menuRoles[menuRole]);
		}
	});
	contextMenuSubmenus.addEventListener('click', (e) => {
		exitContextMenu();

		const menuClicked = e.target as HTMLElement;
		const menuRole = menuClicked?.getAttribute('role');
		if (!menuRole) return;

		if (typeof menuRoles[menuRole] === 'function') menuRoles[menuRole]();
		else eval(menuRoles[menuRole]);
	});
};

export default ContextMenu;
export { ExtendedMenu, addExtendedMenu };
