import { APP_PREFIX_PATH } from "config/constant";

APP_PREFIX_PATH
const menuItems = {
  items: [
    {
      id: 'navigation',

      type: 'group',
      icon: 'icon-navigation',
      children: [
        {
          id: 'dashboard',
          title: 'Dashboard',
          type: 'item',
          icon: 'feather icon-home',
          url: APP_PREFIX_PATH + '/dashboard'
        },
        {
          id: 'manage-customer',
          title: 'Manage customer',
          icon: 'feather icon-user',
          type: 'collapse',
          children: [
            {
              id: 'customer-list',
              title: 'Customer List',
              type: 'item',
              icon: 'feather icon-user',
              url: APP_PREFIX_PATH + '/customer_list'
            },

            {
              id: 'delete-list',
              title: 'Deleted Customer',
              type: 'item',
              icon: 'feather icon-user-minus',
              url: APP_PREFIX_PATH + '/deleted_list'
            }
          ]
        },
        {
          id: 'manage-banner',
          title: 'Manage Blog',
          type: 'item',
          icon: 'feather icon-briefcase',
          url: APP_PREFIX_PATH + '/manage_banner'
        },
        {
          id: 'manage-category',
          title: 'Manage Category',
          type: 'item',
          icon: 'feather icon-box',
          url: APP_PREFIX_PATH + '/manage_category'
        },
           {
          id: 'manage-question',
          title: 'Manage Question',
          type: 'item',
          icon: 'feather icon-box',
          url: APP_PREFIX_PATH + '/question'
        },
        {
          id: 'manage-contact',
          title: 'Manage Contact Us',
          type: 'item',
          icon: 'feather icon-phone',
          url: APP_PREFIX_PATH + '/manage-contact'
        },
        {
          id: 'manage-broadcast',
          title: 'Manage Broadcast',
          type: 'item',
          icon: 'feather icon-compass',
          url: APP_PREFIX_PATH + '/manage-broadcast'
        },
        {
          id: 'manage-booking',
          title: 'Manage Booking',
          type: 'item',
          icon: 'feather icon-package',
          url: APP_PREFIX_PATH + '/manage-booking'
        },
        {
          id: 'manage-content',
          title: 'Manage Content',
          type: 'item',
          icon: 'feather icon-tablet',
          url: APP_PREFIX_PATH + '/manage-content'
        },
        {
          id: 'tabular-report',
          title: 'Tabular Report',
          type: 'collapse',
          icon: 'feather icon-tablet',
          children: [
            {
              id: 'customer-report',
              title: 'Customer Report',
              type: 'item',
              icon: 'feather icon-tablet',
              url: APP_PREFIX_PATH + '/customer-report'
            }
          ]
        },
        {
          id: 'analytical-report',
          title: 'Analytical Report',
          type: 'collapse',
          icon: 'feather icon-layout',
          children: [
            {
              id: 'customer-ana-report',
              title: 'Customer Analytical Report',
              type: 'item',
              icon: 'feather icon-layout',
              url: APP_PREFIX_PATH + '/customer-ana-report'
            }
          ]
        }
      ]
    }
  ]
};

export default menuItems;
