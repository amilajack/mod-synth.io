# import audio.components.Component
class Envelope extends Component

    constructor: (data) ->
        super data

        @parameters.attack = data.settings.attack
        @parameters.decay =  data.settings.decay
        @parameters.sustain =  data.settings.sustain
        @parameters.release = data.settings.release

        App.SETTINGS_CHANGE.add @onSettingsChange

    onSettingsChange: (event) =>
        if event.component is @component_session_uid
            @attack = Session.SETTINGS[@component_session_uid].settings.attack
            @decay = Session.SETTINGS[@component_session_uid].settings.decay
            @sustain = Session.SETTINGS[@component_session_uid].settings.sustain
            @release = Session.SETTINGS[@component_session_uid].settings.release
        null

    @property 'attack',
        get: ->
            return @parameters.attack
        set: (value) ->
            return @parameters.attack if @parameters.attack is value
            @parameters.attack = value
            return @parameters.attack

    @property 'decay',
        get: ->
            return @parameters.decay
        set: (value) ->
            return @parameters.decay if @parameters.decay is value
            @parameters.decay = value
            return @parameters.decay

    @property 'sustain',
        get: ->
            return @parameters.sustain
        set: (value) ->
            return @parameters.sustain if @parameters.sustain is value
            @parameters.sustain = value
            return @parameters.sustain

    @property 'release',
        get: ->
            return @parameters.release
        set: (value) ->
            return @parameters.release if @parameters.release is value
            @parameters.release = value
            return @parameters.release
