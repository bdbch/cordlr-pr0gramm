const CordlrPlugin = require('cordlr-plugin')
const request = require('request')

module.exports = class Plugin extends CordlrPlugin {
  constructor (bot, config) {
    super (bot, config)

    this.name = 'Cordlr Pr0gramm'
    this.description = 'Gets back random pr0gramm posts.'

    this.commands = {
      'random': {
        'usage': '<optional: tags>',
        'function': 'getRandomPost',
        'description': 'Returns a random Pr0gramm post',
        'permissions': []
      },
      'user': {
        'usage': '<name>',
        'function': 'getUserInfo',
        'description': 'Returns a users info',
        'permissions': []
      }
    }

    this.apiBase = 'https://pr0gramm.com/api'

    this.endpoints = {
      'getItems': '/items/get',
      'getUser': '/profile/info'
    }

    this.footerLogo = 'https://pbs.twimg.com/profile_images/500297635203268608/jOiORHPu_400x400.png'
    this.footer = this.embedFooter ('Cordlr Pr0gramm', this.footerLogo)
    this.resolveConfiguration ()
  }

  resolveConfiguration () {
    if (!this.config['cordlr-pr0gramm']) {
      this.config['cordlr-pr0gramm'] = {}
    }
    this.roleConfig = this.config['cordlr-pr0gramm']
  }

  getRandomPost (message, args, flags) {
    let requestURL = this.apiBase + this.endpoints.getItems
    if (args[0])
      requestURL += '?tags=' + args[0]

    request(requestURL, (e, res, body) => {
      if (!e) {
        const data = JSON.parse(body)
        const count = data.items.length
        const postID = Math.floor(Math.random() * (count + 1))
        const post = data.items[postID]


        return this.sendEmbed(message, {
          title: 'Pr0gramm Post by ' + post.user,
          description: 'Upvotes: ' + post.up + ' | Downvotes: ' + post.down,
          url: 'https://pr0gramm.com/new/' + post.id,
          image: this.embedImage('http://thumb.pr0gramm.com/' + post.thumb),
          footer: this.footer
        })
      }

      return this.sendEmbed(message, {
        title: 'Pr0gramm API is not available',
        footer: this.footer
      })
    })
  }

  getUserInfo (message, args, flags) {
    if (!args[0])
      return false

    const requestURL = this.apiBase + this.endpoints.getUser + '?name=' + args[0]

    request(requestURL, (e, res, body) => {
      if (!e) {
        const data = JSON.parse(body)
        const registerDate = new Date(data.user.registered * 1000)

        console.log(data)
        return this.sendEmbed(message, {
          fields: [
            this.embedField('Name', data.user.name),
            this.embedField('Registered since', registerDate.getUTCDate() + '.' + (parseInt(registerDate.getUTCMonth()) + 1) + '.' + registerDate.getUTCFullYear()),
            this.embedField('Benis', data.user.score),
            this.embedField('Uploads', data.uploadCount),
            this.embedField('Comments', data.commentCount),
            this.embedField('Likes', data.likeCount),
            this.embedField('Tags', data.tagCount)
          ]
        })
      }

      return this.sendEmbed(message, {
        title: 'User ' + args[0] + ' not found.',
        footer: this.footer
      })
    })
  }
}
