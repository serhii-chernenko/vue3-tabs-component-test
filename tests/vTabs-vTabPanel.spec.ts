import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import type { VueWrapper, DOMWrapper } from '@vue/test-utils'
import vTabs from '../src/components/vTabs.vue'
import vTabPanel from '../src/components/vTabPanel.vue'

const tabs: number = 3
const { layout, attachTo } = {
    layout: {
        components: {
            vTabs,
            vTabPanel,
        },
        template: `
            <vTabs>
                ${Array.from({ length: tabs }, (_, index) => {
                    index++

                    return `
                        <vTabPanel title="Tab ${index}">
                            <p>Tab ${index} content</p>
                        </vTabPanel>
                    `
                }).join('')}
            </vTabs>
        `,
    },
    attachTo: {
        attachTo: document.body,
    },
}

const getElement = (
    wrapper: VueWrapper,
    nth: number = 1,
    element: 'title' | 'content',
): DOMWrapper<Element> => {
    return wrapper.find(`[data-test="tab-${element}"]:nth-child(${nth})`)
}

const getTitle = (
    wrapper: VueWrapper,
    nth: number = 1,
): DOMWrapper<Element> => {
    return getElement(wrapper, nth, 'title')
}

const getContent = (
    wrapper: VueWrapper,
    nth: number = 1,
): DOMWrapper<Element> => {
    return getElement(wrapper, nth, 'content')
}

describe('the use of vTabsPanel with vTabs', () => {
    it('renders the tab titles', async () => {
        const wrapper = mount(layout, attachTo)

        await wrapper.vm.$nextTick()

        expect(getTitle(wrapper).text()).toBe('Tab 1')
        expect(getTitle(wrapper, 2).text()).toBe('Tab 2')
        expect(getTitle(wrapper, 3).text()).toBe('Tab 3')
    })

    it('renders the tab panel content', async () => {
        const wrapper = mount(layout, attachTo)

        await wrapper.vm.$nextTick()

        expect(getContent(wrapper, 1).text()).toBe('Tab 1 content')
        expect(getContent(wrapper, 2).text()).toBe('Tab 2 content')
        expect(getContent(wrapper, 3).text()).toBe('Tab 3 content')
    })

    it('only shows the content for the active panel on click', async () => {
        const wrapper = mount(layout, attachTo)

        await wrapper.vm.$nextTick()

        const content1 = getContent(wrapper, 1)
        const content2 = getContent(wrapper, 2)

        expect(content1.isVisible()).toBe(true)

        await getTitle(wrapper, 2).trigger('click')

        expect(content1.isVisible()).toBe(false)
        expect(content2.isVisible()).toBe(true)

        await getTitle(wrapper, 3).trigger('click')

        expect(content1.isVisible()).toBe(false)
        expect(content2.isVisible()).toBe(false)
        expect(getContent(wrapper, 3).isVisible()).toBe(true)
    })
})
