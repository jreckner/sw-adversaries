
import React from "react";
import { dice, id, symbolise } from "lib/utils";

function getWeaponDetails(weapon, character, allSkills) {
	if(!("id" in weapon)) {
		weapon.id = id(weapon.name);
	}

	// melee weapon so work out brawn damage
	if("plus-damage" in weapon) {
		let brawn  = character.characteristics.Brawn;

		weapon["damage"] = weapon["plus-damage"] + brawn;
	}

	// get dice values
	let skill = allSkills.find(s => s.name == weapon.skill);

	if(skill == null) {
		weapon.images = [];

		return weapon;
	}

	let stat = character.characteristics[skill.characteristic] || 0;
	let value = character.skills[weapon.skill] || 0;

	weapon.icons = dice(stat, value);

	return weapon;
}

export default class WeaponsPanel extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			quality: null
		};
	}

	setQuality(evt) {
		let name = evt.target.innerText.replace(/\s\d{1,}$/, "");

		let allQualities = this.props.qualities.all();
		let quality = allQualities.find(q => q.name == name);

		if(quality) {
			this.setState({
				quality: quality
			});
		}
	}

	hideQuality(evt) {
		this.setState({
			quality: null
		});
	}

	render() {
		if(this.props.character == null) {
			return null;
		}

		let character = this.props.character;
		let weapons = [];
		let allWeapons = this.props.weapons != null ? this.props.weapons.all() : null;
		let allSkills = this.props.skills != null ? this.props.skills.all() : null;

		if(allWeapons == null || allSkills == null) {
			return null;
		}

		character.weapons.forEach(w => {
			let weapon = allWeapons.find(a => a.name == w);

			if(!weapon) {
				return null;
			}

			weapons.push(getWeaponDetails(weapon, character, allSkills));
		});

		if("specialist-weapons" in character) {
			character["specialist-weapons"].forEach(w => weapons.push(getWeaponDetails(w, character, allSkills)));
		}

		return <div className="info">
			<h2>Weapons</h2>
			{ weapons.length == 0 ? "–" :
			<table className="weapons">
				<thead>
					<tr>
						<th>Weapon</th>
						<th>Range</th>
						<th>Damage</th>
						<th>Roll</th>
						<th>Qualities</th>
					</tr>
				</thead>
				<tbody>
					{ weapons.map(w => {
						return <tr key={ w.id }>
							<td>{ w.name }<br /><small>{ w.skill }</small></td>
							<td><small>{ w.range }</small></td>
							<td>
								<div><small className="damage">Damage:</small> { w.damage || "–" }</div>
								<div><small className="damage">Critical:</small> { w.critical || "–" }</div>
							</td>
							<td dangerouslySetInnerHTML={ w.icons } />
							<td>{ w.qualities.length == 0 ?  "–" : w.qualities.map(q => <div key={ id(q) }><span className="link" onClick={ this.setQuality.bind(this) }>{ q }</span></div>) }</td>
						</tr>
					}) }
				</tbody>
			</table> }
			{ this.state.quality != null ? <div className="quality">
				<h3>{ this.state.quality.name } <small>({ this.state.quality.type })</small></h3>
				{ this.state.quality.description.split("\n\n").map((l, i) => <p key={ i } dangerouslySetInnerHTML={ symbolise(l) } />) }
				<div className="text-right">
					<small className="link" onClick={ this.hideQuality.bind(this) }>Close</small>
				</div>
			</div> : null }
		</div>;
	}
}