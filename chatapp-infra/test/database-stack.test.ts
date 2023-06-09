import {App} from 'aws-cdk-lib'
import {Template} from 'aws-cdk-lib/assertions'
import {DatabaseStack} from '../lib/database-stack'

const databaseStackProps = {
    env: {
        account: '12345789',
        region: 'aws-region'
    }
}

describe('DatabaseStackTest', () => {

    it('should match snapshot', function () {
        // given
        const app = new App()

        // when
        const testStack = new DatabaseStack(app, 'DatabaseStack', databaseStackProps)

        // then
        const template = Template.fromStack(testStack)
        expect(template).toMatchSnapshot()
    })
})
